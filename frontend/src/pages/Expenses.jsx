import { useEffect, useState } from 'react'
import { expenseApi, categoryApi } from '../api/client'
import ExpenseRow from '../components/ExpenseRow'
import ExpenseModal from '../components/ExpenseModal'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [filterMonth, setFilterMonth] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCategories()
    loadExpenses()
  }, [])

  useEffect(() => {
    if (filterMonth) {
      loadByMonth(filterMonth)
    } else if (filterCategory) {
      loadByCategory(filterCategory)
    } else {
      loadExpenses()
    }
  }, [filterMonth, filterCategory])

  async function loadCategories() {
    const res = await categoryApi.getAll()
    setCategories(res?.category ?? [])
  }

  async function loadExpenses() {
    try {
      setLoading(true)
      const res = await expenseApi.getAll()
      setExpenses(res?.expense ?? [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadByMonth(month) {
    try {
      setLoading(true)
      const res = await expenseApi.getByMonth(month)
      setExpenses(res?.expense ?? [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadByCategory(name) {
    try {
      setLoading(true)
      const res = await expenseApi.getByCategory(name)
      setExpenses(res?.expense ?? [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(data) {
    try {
      if (editing) {
        await expenseApi.update(editing.expenseId, data)
      } else {
        await expenseApi.add(data)
      }
      setModalOpen(false)
      setEditing(null)
      if (filterMonth) loadByMonth(filterMonth)
      else if (filterCategory) loadByCategory(filterCategory)
      else loadExpenses()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this expense?')) return
    try {
      await expenseApi.delete(id)
      if (filterMonth) loadByMonth(filterMonth)
      else if (filterCategory) loadByCategory(filterCategory)
      else loadExpenses()
    } catch (err) {
      alert(err.message)
    }
  }

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Expenses</h2>
          <p className="text-slate-500">Manage all your transactions</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true) }}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
        >
          + Add Expense
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filterMonth}
          onChange={(e) => { setFilterMonth(e.target.value); setFilterCategory('') }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          <option value="">All months</option>
          {months.map((m) => (
            <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setFilterMonth('') }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error} — Make sure your Spring Boot backend is running on port 8080.
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-10 text-center text-slate-400">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="px-6 py-10 text-center text-slate-400">No expenses found.</p>
        ) : (
          expenses.map((expense) => (
            <ExpenseRow
              key={expense.expenseId}
              expense={expense}
              onEdit={(e) => { setEditing(e); setModalOpen(true) }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={handleSave}
        expense={editing}
        categories={categories}
      />
    </div>
  )
}
