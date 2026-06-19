import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Categories from './pages/Categories'
import Reports from './pages/Reports'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (id) => {
    setPage(id)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={page}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
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
          {page === 'reports' && <Reports />}
          {page === 'categories' && <Categories />}
        </main>
      </div>
    </div>
  )
}
