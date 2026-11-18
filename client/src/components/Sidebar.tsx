const links = ["Dashboard", "Transactions", "Budgets", "Reports"];

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <h1 className="mb-6 text-xl font-bold text-indigo-600">FinTrack</h1>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            {link}
          </a>
        ))}
      </nav>
    </aside>
  );
}
