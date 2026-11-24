import { Schema, model } from 'mongoose'

const transactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ['income', 'expense'] },
    category: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true },
)

export const Transaction = model('Transaction', transactionSchema)