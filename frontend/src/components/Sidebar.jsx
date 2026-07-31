import { API_BASE } from '../api/client'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'expenses', label: 'Expenses', icon: '📋' },
  { id: 'savings', label: 'Savings', icon: '💰' },
  { id: 'debts', label: 'Debts', icon: '🤝' },
  { id: 'scheduled', label: 'Bills & Subs', icon: '📅' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'categories', label: 'Categories', icon: '🏷️' },
  { id: 'account', label: 'Account', icon: '👤' },
]

export default function Sidebar({ activePage, onNavigate, open, onClose, onLogout }) {
  const username = sessionStorage.getItem('username') || 'User'

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
              ₹
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Expense Tracker</h1>
              <p className="text-xs text-slate-400">Welcome, {username}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
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

        <div className="border-t border-slate-700 px-6 py-4 space-y-3">
          <button
            onClick={onLogout}
            className="w-full rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
