import { useState, useEffect } from 'react'
import { savingsApi } from '../api/client'
import ConfirmModal from '../components/ConfirmModal'

export default function Savings() {
  const [savingsList, setSavingsList] = useState([])
  const [summary, setSummary] = useState({ totalSavings: 0, currentMonthSavings: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form states
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [formLoading, setFormLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const listData = await savingsApi.getAll()
      const summaryData = await savingsApi.getSummary()
      setSavingsList(listData.savings || [])
      setSummary(summaryData)
    } catch (err) {
      setError(err.message || 'Failed to fetch savings data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be positive')
      return
    }

    setFormLoading(true)
    setError('')
    try {
      await savingsApi.add({
        amount: parseFloat(amount),
        description: description.trim(),
        date: date,
      })
      setAmount('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to add savings record')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = (id) => {
    setDeleteTargetId(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    setError('')
    try {
      await savingsApi.delete(deleteTargetId)
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to delete savings record')
    } finally {
      setDeleteModalOpen(false)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Savings Tracker</h1>
          <p className="text-sm text-slate-500">Track and manage your growth funds and surplus income</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Savings</p>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
              ₹{summary.totalSavings?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 text-xl font-bold">
            📈
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Added This Month</p>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
              ₹{summary.currentMonthSavings?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 text-xl font-bold">
            📅
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 mb-6">Add New Allocation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="e.g. Monthly transfer to index fund"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-400 transition disabled:opacity-50"
              >
                {formLoading ? 'Saving...' : 'Add Saving'}
              </button>
            </form>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 mb-6">Savings Log</h2>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : savingsList.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No savings records found. Start seeding or add one above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 px-4">Description</th>
                      <th className="pb-3 px-4 text-right">Amount</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {savingsList.map((saving) => (
                      <tr key={saving.savingId} className="group hover:bg-slate-50/50 transition">
                        <td className="py-4 pr-4 text-slate-500">
                          {new Date(saving.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4 text-slate-800">{saving.description || 'N/A'}</td>
                        <td className="py-4 px-4 text-right text-emerald-600 font-semibold">
                          ₹{saving.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <button
                            onClick={() => handleDelete(saving.savingId)}
                            className="rounded-lg border border-rose-100 px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-50 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Savings Record"
        message="Are you sure you want to delete this savings record?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
