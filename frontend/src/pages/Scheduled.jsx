import { useState, useEffect } from 'react'
import { scheduledApi, subscriptionApi } from '../api/client'
import ConfirmModal from '../components/ConfirmModal'

export default function Scheduled() {
  const [activeTab, setActiveTab] = useState('bills') // 'bills' or 'subs'
  const [bills, setBills] = useState([])
  const [options, setOptions] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form states - Bills
  const [billName, setBillName] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [billOption, setBillOption] = useState('')
  const [billDate, setBillDate] = useState('')
  const [newOption, setNewOption] = useState('')
  const [billFormLoading, setBillFormLoading] = useState(false)
  const [editingBill, setEditingBill] = useState(null)

  // Form states - Subscriptions
  const [subName, setSubName] = useState('')
  const [subAmount, setSubAmount] = useState('')
  const [billingCycle, setBillingCycle] = useState('MONTHLY')
  const [subDate, setSubDate] = useState('')
  const [subFormLoading, setSubFormLoading] = useState(false)
  const [editingSub, setEditingSub] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteType, setDeleteType] = useState('bill') // 'bill' or 'sub'
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const billsData = await scheduledApi.getAll()
      const optsData = await scheduledApi.getOptions()
      const subsData = await subscriptionApi.getAll()
      setBills(billsData || [])
      setOptions(optsData || [])
      setSubscriptions(subsData || [])
      if (optsData && optsData.length > 0) {
        setBillOption(optsData[0].optionName)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bills/subscriptions data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Bill Actions
  const handleAddBill = async (e) => {
    e.preventDefault()
    if (!billName.trim() || !billAmount || !billOption || !billDate) {
      setError('Please fill in all bill fields')
      return
    }
    setBillFormLoading(true)
    setError('')
    try {
      if (editingBill) {
        await scheduledApi.update(editingBill.scheduledId, {
          name: billName.trim(),
          amount: parseFloat(billAmount),
          categoryOption: billOption,
          dueDate: billDate,
          status: editingBill.status || 'PENDING',
        })
        setEditingBill(null)
      } else {
        await scheduledApi.add({
          name: billName.trim(),
          amount: parseFloat(billAmount),
          categoryOption: billOption,
          dueDate: billDate,
          status: 'PENDING',
        })
      }
      setBillName('')
      setBillAmount('')
      setBillDate('')
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to save scheduled bill')
    } finally {
      setBillFormLoading(false)
    }
  }

  const handleToggleStatus = async (bill) => {
    setError('')
    try {
      const nextStatus = bill.status === 'PAID' ? 'PENDING' : 'PAID'
      await scheduledApi.update(bill.scheduledId, {
        name: bill.name,
        amount: bill.amount,
        categoryOption: bill.categoryOption,
        dueDate: bill.dueDate,
        status: nextStatus,
      })
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to update bill status')
    }
  }

  const handleDeleteBill = (id) => {
    setDeleteType('bill')
    setDeleteTargetId(id)
    setDeleteModalOpen(true)
  }

  const handleAddOption = async (e) => {
    e.preventDefault()
    if (!newOption.trim()) return
    setError('')
    try {
      const res = await scheduledApi.addOption({ optionName: newOption.trim() })
      setOptions([...options, res])
      setBillOption(res.optionName)
      setNewOption('')
    } catch (err) {
      setError(err.message || 'Failed to add bill category option')
    }
  }

  // Subscription Actions
  const handleAddSub = async (e) => {
    e.preventDefault()
    if (!subName.trim() || !subAmount || !subDate) {
      setError('Please fill in all subscription fields')
      return
    }
    setSubFormLoading(true)
    setError('')
    try {
      if (editingSub) {
        await subscriptionApi.update(editingSub.subscriptionId, {
          serviceName: subName.trim(),
          amount: parseFloat(subAmount),
          billingCycle,
          nextPaymentDate: subDate,
        })
        setEditingSub(null)
      } else {
        await subscriptionApi.add({
          serviceName: subName.trim(),
          amount: parseFloat(subAmount),
          billingCycle,
          nextPaymentDate: subDate,
        })
      }
      setSubName('')
      setSubAmount('')
      setSubDate('')
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to save subscription')
    } finally {
      setSubFormLoading(false)
    }
  }

  const handleEditSub = (sub) => {
    setEditingSub(sub)
    setSubName(sub.serviceName)
    setSubAmount(sub.amount.toString())
    setBillingCycle(sub.billingCycle)
    setSubDate(sub.nextPaymentDate)
  }

  const handleDeleteSub = (id) => {
    setDeleteType('sub')
    setDeleteTargetId(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    setError('')
    try {
      if (deleteType === 'bill') {
        const id = deleteTargetId
        await scheduledApi.delete(id)
        if (editingBill && editingBill.scheduledId === id) {
          setEditingBill(null)
          setBillName('')
          setBillAmount('')
          setBillDate('')
        }
      } else {
        const id = deleteTargetId
        await subscriptionApi.delete(id)
        if (editingSub && editingSub.subscriptionId === id) {
          setEditingSub(null)
          setSubName('')
          setSubAmount('')
          setSubDate('')
        }
      }
      await fetchData()
    } catch (err) {
      setError(err.message || `Failed to delete ${deleteType}`)
    } finally {
      setDeleteModalOpen(false)
      setDeleteTargetId(null)
    }
  }

  // Brand-Specific Styles for Subscriptions
  const getSubStyles = (name) => {
    const checkName = name.toLowerCase()
    if (checkName.includes('netflix')) {
      return { bgColor: 'bg-rose-950/20 border-rose-500/30', badgeBg: 'bg-rose-500/10 text-rose-500', dot: 'bg-rose-500' }
    }
    if (checkName.includes('spotify')) {
      return { bgColor: 'bg-emerald-950/20 border-emerald-500/30', badgeBg: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-500' }
    }
    if (checkName.includes('youtube')) {
      return { bgColor: 'bg-red-950/20 border-red-500/30', badgeBg: 'bg-red-500/10 text-red-400', dot: 'bg-red-500' }
    }
    if (checkName.includes('amazon') || checkName.includes('prime')) {
      return { bgColor: 'bg-sky-950/20 border-sky-500/30', badgeBg: 'bg-sky-500/10 text-sky-400', dot: 'bg-sky-500' }
    }
    if (checkName.includes('linkedin')) {
      return { bgColor: 'bg-blue-950/20 border-blue-500/30', badgeBg: 'bg-blue-500/10 text-blue-400', dot: 'bg-blue-505 bg-blue-500' }
    }
    return { bgColor: 'bg-slate-900/50 border-slate-700/50', badgeBg: 'bg-slate-700 text-slate-300', dot: 'bg-slate-400' }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bills & Subscriptions</h1>
        <p className="text-sm text-slate-500">Track and pay your recurrent utilities and entertainment services</p>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('bills')}
          className={`px-6 py-3 text-sm font-semibold transition ${
            activeTab === 'bills'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📅 Scheduled Bills
        </button>
        <button
          onClick={() => setActiveTab('subs')}
          className={`px-6 py-3 text-sm font-semibold transition ${
            activeTab === 'subs'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          💳 Active Subscriptions
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="flex justify-center py-20 bg-white border border-slate-100 rounded-3xl">
          <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : activeTab === 'bills' ? (
        /* Bills Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bill Form Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Bill Option */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-md font-bold text-slate-850 mb-3 text-slate-800">Add Bill option</h2>
              <form onSubmit={handleAddOption} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="e.g. Gas, rent"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Add
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950 mb-4">
                {editingBill ? 'Edit Scheduled Bill' : 'Schedule Bill'}
              </h2>
              <form onSubmit={handleAddBill} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Bill Title
                  </label>
                  <input
                    type="text"
                    required
                    value={billName}
                    onChange={(e) => setBillName(e.target.value)}
                    placeholder="e.g. Water surcharge"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
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
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Bill Category
                  </label>
                  <select
                    value={billOption}
                    onChange={(e) => setBillOption(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  >
                    {options.map((opt) => (
                      <option key={opt.optionId} value={opt.optionName}>
                        {opt.optionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={billFormLoading}
                    className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition"
                  >
                    {billFormLoading
                      ? 'Saving...'
                      : editingBill
                      ? 'Save Changes'
                      : 'Schedule Bill'}
                  </button>
                  {editingBill && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBill(null)
                        setBillName('')
                        setBillAmount('')
                        setBillDate('')
                      }}
                      className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-550 hover:bg-slate-50 transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Bills List Column */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950 mb-6">Upcoming & Settled Bills</h2>
              {bills.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  No scheduled bills found. Add one on the left!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-3 pr-4">Bill</th>
                        <th className="pb-3 px-4">Due Date</th>
                        <th className="pb-3 px-4">Category</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 px-4 text-right">Amount</th>
                        <th className="pb-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {bills.map((bill) => (
                        <tr key={bill.scheduledId} className="group hover:bg-slate-50/50 transition">
                          <td className="py-4 pr-4 text-slate-900">{bill.name}</td>
                          <td className="py-4 px-4 text-slate-500">
                            {new Date(bill.dueDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 font-semibold">
                              {bill.categoryOption}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleToggleStatus(bill)}
                              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                                bill.status === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}
                            >
                              {bill.status}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right text-slate-900 font-semibold">
                            ₹{bill.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingBill(bill)
                                  setBillName(bill.name)
                                  setBillAmount(bill.amount.toString())
                                  setBillOption(bill.categoryOption)
                                  setBillDate(bill.dueDate)
                                }}
                                className="text-slate-500 hover:text-slate-700 text-xs font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBill(bill.scheduledId)}
                                className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
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
          </div>
        </div>
      ) : (
        /* Subscriptions Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscriptions Form Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950 mb-4">
                {editingSub ? 'Edit Subscription' : 'Add Subscription'}
              </h2>
              <form onSubmit={handleAddSub} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="e.g. Spotify"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={subAmount}
                    onChange={(e) => setSubAmount(e.target.value)}
                    placeholder="e.g. 199"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Billing Cycle
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  >
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="YEARLY">YEARLY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Next Renewal Date
                  </label>
                  <input
                    type="date"
                    required
                    value={subDate}
                    onChange={(e) => setSubDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={subFormLoading}
                    className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition"
                  >
                    {subFormLoading
                      ? 'Saving...'
                      : editingSub
                      ? 'Save Changes'
                      : 'Add Subscription'}
                  </button>
                  {editingSub && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSub(null)
                        setSubName('')
                        setSubAmount('')
                        setSubDate('')
                      }}
                      className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-550 hover:bg-slate-50 transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Subscriptions List Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-slate-950 mb-2">Tracked Subscriptions</h2>
            {subscriptions.length === 0 ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-slate-400">
                No active subscriptions found.
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => {
                  const style = getSubStyles(sub.serviceName)
                  return (
                    <div
                      key={sub.subscriptionId}
                      className={`relative flex flex-col md:flex-row md:items-center justify-between rounded-3xl border p-5 shadow-sm transition hover:shadow-md gap-4 ${style.bgColor}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className={`h-3 w-3 rounded-full shrink-0 ${style.dot}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-base font-bold text-slate-900 truncate">
                              {sub.serviceName}
                            </h3>
                            <span
                              className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0 ${style.badgeBg}`}
                            >
                              {sub.billingCycle}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-slate-500">
                            <span>
                              Cost: ₹
                              {sub.amount?.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              Next:{' '}
                              {new Date(sub.nextPaymentDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => handleEditSub(sub)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm animate-fade-in"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSub(sub.subscriptionId)}
                          className="rounded-xl border border-rose-200 bg-rose-50/50 p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition shadow-sm"
                          title="Delete Subscription"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={deleteType === 'bill' ? 'Delete Scheduled Bill' : 'Delete Subscription'}
        message={deleteType === 'bill' ? 'Are you sure you want to delete this scheduled bill?' : 'Are you sure you want to cancel and delete this subscription tracker?'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
