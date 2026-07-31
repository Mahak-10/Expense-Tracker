import { getCategoryStyle } from '../utils/categories'
import { formatCurrency } from '../utils/format'

export default function ExpenseRow({ expense, onEdit, onDelete }) {
  const style = getCategoryStyle(expense.categoryName)

  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 last:border-0 hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${style.color}`}>
          {style.icon}
        </div>
        <div>
          <p className="font-medium text-slate-900">{expense.description || 'No description'}</p>
          <p className="text-sm text-slate-500">{expense.categoryName || 'Uncategorized'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-semibold text-slate-900">{formatCurrency(expense.amount)}</span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(expense)}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-primary"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(expense.expenseId)}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
