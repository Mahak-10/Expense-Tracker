import { useEffect, useState } from 'react'

export default function ExpenseModal({ isOpen, onClose, onSave, expense, categories }) {
  const [form, setForm] = useState({ amount: '', description: '', categoryId: '' })

  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount ?? '',
        description: expense.description ?? '',
        categoryId: expense.categoryId ?? '',
      })
    } else {
      setForm({ amount: '', description: '', categoryId: categories[0]?.categoryId ?? '' })
    }
  }, [expense, categories, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      amount: parseFloat(form.amount),
      description: form.description,
      categoryId: Number(form.categoryId),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{expense ? 'Edit Expense' : 'Add Expense'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="450.00"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Lunch at cafe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Category *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
            >
              {expense ? 'Update' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
