import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mb-4 text-slate-600">The page you are looking for doesn’t exist.</p>
      <Link to="/" className="text-indigo-700 hover:underline">Back to the dashboard</Link>
    </>
  )
}