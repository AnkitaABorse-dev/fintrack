import { Router } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { Transaction } from '../models/Transaction.js'

export const transactionsRouter = Router()

const CATEGORIES = ['Food', 'Housing', 'Travel', 'Job', 'Side work', 'Other'] as const

const createSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title is too long'),
  amount: z.number('Amount must be a number').positive('Amount must be greater than 0').max(1_000_000_000),
  type: z.enum(['income', 'expense']),
  category: z.enum(CATEGORIES),
  date: z.iso.date('Date must look like 2026-11-08'),
})

function toDto(t: {
  id: string
  title: string
  amount: number
  type: string
  category: string
  date: string
}) {
  return { id: t.id, title: t.title, amount: t.amount, type: t.type, category: t.category, date: t.date }
}

transactionsRouter.use(requireAuth)

transactionsRouter.get('/', async (_req, res) => {
  const items = await Transaction.find({ user: res.locals.userId }).sort({ date: -1, createdAt: -1 })
  res.json({ transactions: items.map(toDto) })
})

transactionsRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues.map((i) => i.message) })
    return
  }

  const created = await Transaction.create({ ...parsed.data, user: res.locals.userId })
  res.status(201).json(toDto(created))
})

transactionsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ errors: ['Transaction not found'] })
    return
  }

  const deleted = await Transaction.findOneAndDelete({ _id: id, user: res.locals.userId })
  if (!deleted) {
    res.status(404).json({ errors: ['Transaction not found'] })
    return
  }

  res.status(204).end()
})