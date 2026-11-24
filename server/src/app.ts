import express from 'express'
import mongoose from 'mongoose'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { transactionsRouter } from './routes/transactions.js'
import { budgetsRouter } from './routes/budgets.js'

export const app = express()

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

app.use('/api/auth', authRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/budgets', budgetsRouter)

app.use(errorHandler)