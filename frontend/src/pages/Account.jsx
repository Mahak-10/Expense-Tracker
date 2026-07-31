import { useState } from 'react'
import { authApi } from '../api/client'

export default function Account() {
  const currentUsername = sessionStorage.getItem('username') || 'User'
  const [username, setUsername] = useState(currentUsername)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' }) // type: 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    if (!username.trim()) {
      setMessage({ text: 'Username cannot be blank', type: 'error' })
      return
    }

    if (password && password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const res = await authApi.updateProfile(username.trim(), password)
      sessionStorage.setItem('username', res.username)
      setMessage({ text: 'Profile updated successfully!', type: 'success' })
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile credentials and security passwords</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-950 mb-6">Profile Details</h2>

        {message.text && (
          <div
            className={`mb-6 rounded-2xl border p-4 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {message.type === 'success' ? '✅ ' : '❌ '}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              placeholder="Username"
            />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Change Password (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? 'Saving Profile...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
