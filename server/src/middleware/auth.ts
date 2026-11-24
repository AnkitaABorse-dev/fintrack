import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    res.status(401).json({ errors: ['Authentication required'] })
    return
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (typeof payload === 'string' || !payload.sub) {
      throw new Error('Unexpected token payload')
    }
    res.locals.userId = payload.sub
    next()
  } catch {
    res.status(401).json({ errors: ['Invalid or expired token'] })
  }
}