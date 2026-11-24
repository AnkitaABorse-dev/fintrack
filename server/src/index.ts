import mongoose from 'mongoose'
import { app } from './app.js'
import { config } from './config.js'

async function start() {
  await mongoose.connect(config.mongoUri)
  console.log('Connected to MongoDB')

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start the server:', error)
  process.exit(1)
})