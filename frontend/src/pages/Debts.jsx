import { useState, useEffect } from 'react'
import { debtApi } from '../api/client'
import ConfirmModal from '../components/ConfirmModal'

export default function Debts() {
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form states
  const [personName, setPersonName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('OWED_TO_ME') // OWED_TO_ME or OWED_TO_OTHERS
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const fetchDebts = async () => {
    try {
      setLoading(true)
      const data = await debtApi.getAll()
      setDebts(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch debts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebts()
  }, [])

  const handleEdit = (debt) => {
    setEditingId(debt.debtId)
    setPersonName(debt.personName)
    setAmount(debt.amount.toString())
    setType(debt.type)
    setDescription(debt.description || '')
    setDueDate(debt.dueDate)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setPersonName('')
    setAmount('')
    setType('OWED_TO_ME')
    setDescription('')
    setDueDate('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!personName.trim() || !amount || parseFloat(amount) <= 0 || !dueDate) {
      setError('Please fill in all required fields correctly')
      return
    }

    setFormLoading(true)
    setError('')
    try {
      const payload = {
        personName: personName.trim(),
        amount: parseFloat(amount),
        type,
        description: description.trim(),
        dueDate,
      }
      if (editingId) {
        await debtApi.update(editingId, payload)
        setEditingId(null)
      } else {
        await debtApi.add(payload)
      }
      // Clear form
      setPersonName('')
      setAmount('')
      setDescription('')
      setDueDate('')
      await fetchDebts()
    } catch (err) {
      setError(err.message || (editingId ? 'Failed to update debt record' : 'Failed to add debt record'))
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
      await debtApi.delete(deleteTargetId)
      await fetchDebts()
    } catch (err) {
      setError(err.message || 'Failed to delete debt')
    } finally {
      setDeleteModalOpen(false)
      setDeleteTargetId(null)
    }
  }

  // Calculations
  const owedToMe = debts.filter((d) => d.type === 'OWED_TO_ME')
  const owedToOthers = debts.filter((d) => d.type === 'OWED_TO_OTHERS')

  const totalOwedToMe = owedToMe.reduce((sum, d) => sum + d.amount, 0)
  const totalOwedToOthers = owedToOthers.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Debts & Loans</h1>
        <p className="text-sm text-slate-500">Keep track of money you lent out or borrow from contacts</p>
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
            <p className="text-sm font-medium text-slate-500">I am Owed (Receivables)</p>
            <h3 className="mt-2 text-3xl font-extrabold text-emerald-600">
              ₹{totalOwedToMe.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 text-xl font-bold">
            🤝
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">I Owe (Payables)</p>
            <h3 className="mt-2 text-3xl font-extrabold text-rose-600">
              ₹{totalOwedToOthers.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 text-xl font-bold">
            💸
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 mb-6">
              {editingId ? 'Modify Debt Entry' : 'Create Debt Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Contact Person
                </label>
                <input
                  type="text"
                  required
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="e.g. Alice"
                />
              </div>

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
                  placeholder="e.g. 1500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Debt Direction
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                >
                  <option value="OWED_TO_ME">OWED_TO_ME (Lent out - I am owed)</option>
                  <option value="OWED_TO_OTHERS">OWED_TO_OTHERS (Borrowed - I owe)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="e.g. Cab ride share"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : editingId ? 'Update Debt' : 'Create Debt'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Content list */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center py-10 bg-white border border-slate-100 rounded-3xl">
              <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : debts.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-slate-400">
              No active debts recorded. Put down a contact entry to start tracking!
            </div>
          ) : (
            <>
              {/* Owed To Me Component */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950 mb-4 text-emerald-700">Receivables (Lent Out Money)</h2>
                {owedToMe.length === 0 ? (
                  <p className="text-slate-400 text-sm">Nobody owes you currently.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                          <th className="pb-3 pr-4">Contact</th>
                          <th className="pb-3 px-4">Due Date</th>
                          <th className="pb-3 px-4">Reason</th>
                          <th className="pb-3 px-4 text-right">Amount</th>
                          <th className="pb-3 pl-4 text-right">Options</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {owedToMe.map((d) => (
                          <tr key={d.debtId} className="group hover:bg-slate-50/50 transition">
                            <td className="py-4 pr-4 text-slate-900">{d.personName}</td>
                            <td className="py-4 px-4 text-slate-500">
                              {new Date(d.dueDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-4 px-4 text-slate-600">{d.description || 'N/A'}</td>
                            <td className="py-4 px-4 text-right text-emerald-600 font-semibold">
                              ₹{d.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(d)}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition"
                                >
                                  Modify
                                </button>
                                <button
                                  onClick={() => handleDelete(d.debtId)}
                                  className="rounded-lg border border-rose-100 px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-50 transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Owed To Others Component */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950 mb-4 text-rose-700">Payables (Borrowed Money)</h2>
                {owedToOthers.length === 0 ? (
                  <p className="text-slate-400 text-sm">You do not owe anything to anyone.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                          <th className="pb-3 pr-4">Contact</th>
                          <th className="pb-3 px-4">Due Date</th>
                          <th className="pb-3 px-4">Reason</th>
                          <th className="pb-3 px-4 text-right">Amount</th>
                          <th className="pb-3 pl-4 text-right">Options</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {owedToOthers.map((d) => (
                          <tr key={d.debtId} className="group hover:bg-slate-50/50 transition">
                            <td className="py-4 pr-4 text-slate-900">{d.personName}</td>
                            <td className="py-4 px-4 text-slate-500">
                              {new Date(d.dueDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-4 px-4 text-slate-600">{d.description || 'N/A'}</td>
                            <td className="py-4 px-4 text-right text-rose-600 font-semibold">
                              ₹{d.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(d)}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition"
                                >
                                  Modify
                                </button>
                                <button
                                  onClick={() => handleDelete(d.debtId)}
                                  className="rounded-lg border border-rose-100 px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-50 transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Debt Record"
        message="Are you sure you want to delete this debt file?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
