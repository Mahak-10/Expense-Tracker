import { useEffect, useState } from 'react'
import { expenseApi } from '../api/client'
import MonthlyChart from '../components/MonthlyChart'
import CategoryDonut from '../components/CategoryDonut'
import { formatCurrency, formatMonth } from '../utils/format'
import { CHART_COLORS } from '../utils/categories'

export default function Reports() {
  const [tab, setTab] = useState('month')
  const [monthwise, setMonthwise] = useState({})
  const [categoryTotals, setCategoryTotals] = useState([])
  const [grouped, setGrouped] = useState({})
  const [selectedMonth, setSelectedMonth] = useState('')
  const [monthExpenses, setMonthExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    try {
      setLoading(true)
      const [monthRes, catRes, groupedRes] = await Promise.all([
        expenseApi.getMonthwise(),
        expenseApi.getCategoryTotals(),
        expenseApi.getGroupedByCategory(),
      ])
      setMonthwise(monthRes ?? {})
      setCategoryTotals(catRes?.expense ?? [])
      setGrouped(groupedRes ?? {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleMonthClick(month) {
    setSelectedMonth(month)
    try {
      const res = await expenseApi.getByMonth(month)
      setMonthExpenses(res?.expense ?? [])
    } catch (err) {
      console.error(err)
    }
  }

  const totalCategory = categoryTotals.reduce((sum, c) => sum + c.amount, 0)

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading reports...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <p className="text-slate-500">Analyze your spending patterns</p>
      </div>

      <div className="flex gap-2">
        {['month', 'category', 'grouped'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {t === 'month' ? 'By Month' : t === 'category' ? 'By Category' : 'Grouped'}
          </button>
        ))}
      </div>

      {tab === 'month' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold">Monthly Spending</h3>
            <MonthlyChart data={monthwise} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(monthwise).map(([month, amount]) => (
              <button
                key={month}
                onClick={() => handleMonthClick(month)}
                className={`rounded-xl border p-4 text-left transition hover:border-primary ${
                  selectedMonth === month ? 'border-primary bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
              >
                <p className="text-sm text-slate-500">{formatMonth(month)}</p>
                <p className="text-xl font-bold">{formatCurrency(amount)}</p>
              </button>
            ))}
          </div>
          {selectedMonth && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">{formatMonth(selectedMonth)} expenses</h3>
              {monthExpenses.length === 0 ? (
                <p className="text-slate-400">No expenses this month</p>
              ) : (
                <ul className="space-y-2">
                  {monthExpenses.map((e) => (
                    <li key={e.expenseId} className="flex justify-between border-b border-slate-100 py-2">
                      <span>{e.description || e.categoryName}</span>
                      <span className="font-medium">{formatCurrency(e.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'category' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <CategoryDonut expenses={categoryTotals} />
            </div>
            <div className="space-y-3">
              {categoryTotals.map((cat, i) => {
                const pct = totalCategory ? Math.round((cat.amount / totalCategory) * 100) : 0
                return (
                  <div key={cat.categoryName} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">{cat.categoryName}</span>
                      <span>{formatCurrency(cat.amount)} ({pct}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'grouped' && (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, items]) => (
            <details key={category} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <summary className="cursor-pointer px-6 py-4 font-semibold">
                {category} ({items.length} expenses)
              </summary>
              <ul className="border-t border-slate-100 px-6 py-2">
                {items.map((e) => (
                  <li key={e.expenseId} className="flex justify-between py-2 text-sm">
                    <span>{e.description || 'No description'}</span>
                    <span className="font-medium">{formatCurrency(e.amount)}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          {Object.keys(grouped).length === 0 && (
            <p className="text-center text-slate-400">No grouped data available</p>
          )}
        </div>
      )}
    </div>
  )
}
