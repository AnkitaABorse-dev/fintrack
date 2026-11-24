import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { ApiError } from '../api'

interface LimitFormProps {
  category: string
  limit: number | undefined
  onSave: (category: string, limit: number | null) => Promise<void>
}

export default function LimitForm({ category, limit, onSave }: LimitFormProps) {
  const [draft, setDraft] = useState(limit ? String(limit) : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave(category, draft.trim() === '' ? null : Number(draft))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <label htmlFor={`limit-${category}`} className="text-sm text-slate-600">
        Monthly limit (₹)
      </label>
      <input
        id={`limit-${category}`}
        type="number"
        min="1"
        className="w-28 rounded-lg border border-slate-300 px-3 py-2"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
      {error && <p role="alert" className="basis-full text-sm text-red-700">{error}</p>}
    </form>
  )
}