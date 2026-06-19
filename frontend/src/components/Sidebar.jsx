import { API_BASE } from '../api/client'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'expenses', label: 'Expenses', icon: '📋' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'categories', label: 'Categories', icon: '🏷️' },
]

export default function Sidebar({ activePage, onNavigate, open, onClose }) {
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar text-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-700 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold">
              ₹
            </div>
            <div>
              <h1 className="text-lg font-semibold">Expense Tracker</h1>
              <p className="text-xs text-slate-400">Personal finance</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activePage === item.id
                  ? 'bg-primary text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-700 px-6 py-4">
          <p className="text-xs text-slate-500">API</p>
          <p className="truncate text-xs text-slate-400">{API_BASE}</p>
        </div>
      </aside>
    </>
  )
}
