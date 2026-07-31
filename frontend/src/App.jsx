import { useState } from 'react'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Categories from './pages/Categories'
import Reports from './pages/Reports'
import Savings from './pages/Savings'
import Debts from './pages/Debts'
import Scheduled from './pages/Scheduled'
import Account from './pages/Account'

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem('userId'))
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!authenticated) {
    return <Login onAuthSuccess={() => setAuthenticated(true)} />
  }

  const navigate = (id) => {
    setPage(id)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    setAuthenticated(false)
    setPage('dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={page}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-semibold text-slate-900">Expense Tracker</span>
        </header>

        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {page === 'dashboard' && <Dashboard onAddExpense={() => navigate('expenses')} />}
          {page === 'expenses' && <Expenses />}
          {page === 'savings' && <Savings />}
          {page === 'debts' && <Debts />}
          {page === 'scheduled' && <Scheduled />}
          {page === 'reports' && <Reports />}
          {page === 'categories' && <Categories />}
          {page === 'account' && <Account />}
        </main>
      </div>
    </div>
  )
}
