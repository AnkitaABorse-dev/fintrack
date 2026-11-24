import mongoose from 'mongoose'
import { app } from './app.js'

const port = Number(process.env.PORT) || 5000
const mongoUri = process.env.MONGODB_URI

async function start() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Check your .env file.')
  }

  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB')

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start the server:', error)
  process.exit(1)
})