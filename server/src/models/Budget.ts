import { Schema, model } from 'mongoose'

const budgetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

// One limit per category per user
budgetSchema.index({ user: 1, category: 1 }, { unique: true })

export const Budget = model('Budget', budgetSchema)