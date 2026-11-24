import { Router } from 'express'
import { z } from 'zod'
import { BUDGET_CATEGORIES } from '../constants.js'
import { requireAuth } from '../middleware/auth.js'
import { Budget } from '../models/Budget.js'

export const budgetsRouter = Router()

const categorySchema = z.enum(BUDGET_CATEGORIES, 'Unknown budget category')
const limitSchema = z.object({
  limit: z.number('Limit must be a number').positive('Limit must be greater than 0').max(1_000_000_000),
})

budgetsRouter.use(requireAuth)

budgetsRouter.get('/', async (_req, res) => {
  const items = await Budget.find({ user: res.locals.userId })
  const budgets: Record<string, number> = {}
  for (const item of items) {
    budgets[item.category] = item.limit
  }
  res.json({ budgets })
})

budgetsRouter.put('/:category', async (req, res) => {
  const category = categorySchema.safeParse(req.params.category)
  const body = limitSchema.safeParse(req.body)

  if (!category.success || !body.success) {
    const errors = [
      ...(category.success ? [] : category.error.issues.map((i) => i.message)),
      ...(body.success ? [] : body.error.issues.map((i) => i.message)),
    ]
    res.status(400).json({ errors })
    return
  }

  await Budget.updateOne(
    { user: res.locals.userId, category: category.data },
    { $set: { limit: body.data.limit } },
    { upsert: true },
  )

  res.json({ category: category.data, limit: body.data.limit })
})

budgetsRouter.delete('/:category', async (req, res) => {
  const category = categorySchema.safeParse(req.params.category)
  if (!category.success) {
    res.status(400).json({ errors: category.error.issues.map((i) => i.message) })
    return
  }

  await Budget.deleteOne({ user: res.locals.userId, category: category.data })
  res.status(204).end()
})