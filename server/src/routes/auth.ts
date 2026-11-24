import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { config } from '../config.js'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'

export const authRouter = Router()

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '7d' })
}

function publicUser(user: { id: string; name: string; email: string }) {
  return { id: user.id, name: user.name, email: user.email }
}

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues.map((i) => i.message) })
    return
  }

  const { name, email, password } = parsed.data
  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    res.status(409).json({ errors: ['An account with this email already exists'] })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, passwordHash })

  res.status(201).json({ token: signToken(user.id), user: publicUser(user) })
})

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues.map((i) => i.message) })
    return
  }

  const { email, password } = parsed.data
  const user = await User.findOne({ email: email.toLowerCase() })
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!user || !passwordMatches) {
    res.status(401).json({ errors: ['Invalid email or password'] })
    return
  }

  res.json({ token: signToken(user.id), user: publicUser(user) })
})

authRouter.get('/me', requireAuth, async (_req, res) => {
  const user = await User.findById(res.locals.userId)
  if (!user) {
    res.status(401).json({ errors: ['Account no longer exists'] })
    return
  }
  res.json({ user: publicUser(user) })
})