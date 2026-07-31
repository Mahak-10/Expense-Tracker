import { useEffect, useState } from 'react'
import { categoryApi } from '../api/client'
import CategoryModal from '../components/CategoryModal'
import { getCategoryStyle } from '../utils/categories'
import ConfirmModal from '../components/ConfirmModal'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

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

  function handleDelete(id) {
    setDeleteTarget(id)
    setDeleteModalOpen(true)
  }

  function handleDeleteAll() {
    setDeleteTarget('ALL')
    setDeleteModalOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    try {
      if (deleteTarget === 'ALL') {
        await categoryApi.deleteAll()
      } else {
        await categoryApi.delete(deleteTarget)
      }
      loadCategories()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleteModalOpen(false)
      setDeleteTarget(null)
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        title={deleteTarget === 'ALL' ? 'Delete All Categories' : 'Delete Category'}
        message={deleteTarget === 'ALL' ? 'Are you sure you want to delete ALL categories? This action cannot be undone.' : 'Are you sure you want to delete this category?'}
        confirmText={deleteTarget === 'ALL' ? 'Delete All' : 'Delete'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
