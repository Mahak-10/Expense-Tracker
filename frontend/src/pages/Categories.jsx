import { useEffect, useState } from 'react'
import { categoryApi } from '../api/client'
import CategoryModal from '../components/CategoryModal'
import { getCategoryStyle } from '../utils/categories'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      const res = await categoryApi.getAll()
      setCategories(res?.category ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(data) {
    try {
      if (editing) {
        await categoryApi.update(editing.categoryId, data)
      } else {
        await categoryApi.add(data)
      }
      setModalOpen(false)
      setEditing(null)
      loadCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    try {
      await categoryApi.delete(id)
      loadCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleDeleteAll() {
    if (!confirm('Delete ALL categories? This cannot be undone.')) return
    try {
      await categoryApi.deleteAll()
      loadCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
          <p className="text-slate-500">Organize your expenses</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            + Add Category
          </button>
          <button
            onClick={handleDeleteAll}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete All
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-slate-400">Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-400">No categories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const style = getCategoryStyle(cat.categoryName)
            return (
              <div key={cat.categoryId} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${style.color}`}>
                    {style.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{cat.categoryName}</h3>
                    <p className="text-xs text-slate-400">ID: {cat.categoryId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(cat); setModalOpen(true) }}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.categoryId)}
                    className="flex-1 rounded-lg border border-red-200 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={handleSave}
        category={editing}
      />
    </div>
  )
}
