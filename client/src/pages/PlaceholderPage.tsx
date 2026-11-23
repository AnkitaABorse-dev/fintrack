export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-slate-600">This page is coming soon.</p>
    </>
  )
}