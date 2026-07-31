import { useEffect, useState } from 'react'
import { expenseApi } from '../api/client'
import StatCard from '../components/StatCard'
import MonthlyChart from '../components/MonthlyChart'
import CategoryDonut from '../components/CategoryDonut'
import ExpenseRow from '../components/ExpenseRow'
import { formatCurrency, getCurrentMonthKey } from '../utils/format'

export default function Dashboard({ onAddExpense }) {
  const [total, setTotal] = useState(0)
  const [monthwise, setMonthwise] = useState({})
  const [categoryTotals, setCategoryTotals] = useState([])
  const [recentExpenses, setRecentExpenses] = useState([])
  const [categoryCount, setCategoryCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [totalRes, monthRes, catRes, expenseRes] = await Promise.all([
        expenseApi.getTotal(),
        expenseApi.getMonthwise(),
        expenseApi.getCategoryTotals(),
        expenseApi.getAll(),
      ])
      setTotal(totalRes ?? 0)
      setMonthwise(monthRes ?? {})
      setCategoryTotals(catRes?.expense ?? [])
      const all = expenseRes?.expense ?? []
      setRecentExpenses(all.slice(-5).reverse())
      setCategoryCount(catRes?.expense?.length ?? 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const currentMonth = getCurrentMonthKey()
  const thisMonth = monthwise[currentMonth] ?? 0

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Overview of your spending</p>
        </div>
        <button
          onClick={onAddExpense}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
        >
          + Add Expense
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Spent" value={formatCurrency(total)} icon="💰" />
        <StatCard title="This Month" value={formatCurrency(thisMonth)} subtitle={currentMonth.toLowerCase()} icon="📅" />
        <StatCard title="Categories" value={categoryCount} subtitle="Active categories" icon="🏷️" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">Monthly Spending</h3>
          <MonthlyChart data={monthwise} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">Spending by Category</h3>
          <CategoryDonut expenses={categoryTotals} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="font-semibold text-slate-900">Recent Expenses</h3>
        </div>
        {recentExpenses.length === 0 ? (
          <p className="px-6 py-10 text-center text-slate-400">No expenses yet. Add your first one!</p>
        ) : (
          recentExpenses.map((expense) => (
            <ExpenseRow key={expense.expenseId} expense={expense} onEdit={() => {}} onDelete={() => {}} />
          ))
        )}
      </div>
    </div>
  )
}
