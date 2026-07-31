import { useState } from 'react'
import { authApi } from '../api/client'

export default function Login({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const res = await authApi.register(username.trim(), password)
        localStorage.setItem('userId', res.userId)
        localStorage.setItem('username', res.username)
      } else {
        const res = await authApi.login(username.trim(), password)
        localStorage.setItem('userId', res.userId)
        localStorage.setItem('username', res.username)
      }
      onAuthSuccess()
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoMode = async () => {
    setError('')
    setDemoLoading(true)
    const demoUser = 'demo_user'
    const demoPass = 'demo123'
    try {
      // First try to login as demo_user
      try {
        const res = await authApi.login(demoUser, demoPass)
        localStorage.setItem('userId', res.userId)
        localStorage.setItem('username', res.username)
        onAuthSuccess()
      } catch (loginErr) {
        // If login fails, attempt to register the demo user (which will auto-seed backend entries)
        const regRes = await authApi.register(demoUser, demoPass)
        localStorage.setItem('userId', regRes.userId)
        localStorage.setItem('username', regRes.username)
        onAuthSuccess()
      }
    } catch (err) {
      setError(err.message || 'Failed to enter Demo Mode.')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-950 to-indigo-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-3xl font-black text-white shadow-lg shadow-emerald-500/30">
            ₹
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-sans">
            Expense Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Manage your personal finances efficiently
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-xl p-8">
          <div className="mb-8 flex justify-center border-b border-slate-805 pb-4 border-slate-800">
            <button
              onClick={() => {
                setIsSignUp(false)
                setError('')
              }}
              className={`flex-1 text-center text-sm font-semibold pb-2 transition ${
                !isSignUp ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true)
                setError('')
              }}
              className={`flex-1 text-center text-sm font-semibold pb-2 transition ${
                isSignUp ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-medium text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-805 bg-slate-950 px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 border-slate-800 transition"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full flex justify-center items-center rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-500/30 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs font-semibold uppercase">
              <span className="bg-slate-900 px-3 text-slate-500">Recruiter Quick Access</span>
            </div>
          </div>

          <button
            onClick={handleDemoMode}
            disabled={loading || demoLoading}
            className="w-full flex justify-center items-center gap-2 rounded-2xl border border-dashed border-indigo-500/50 bg-indigo-500/5 py-3.5 text-sm font-semibold text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500 transition disabled:opacity-50"
          >
            {demoLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Seeding Demo Account...
              </span>
            ) : (
              <>
                <span>⚡</span> Explore Demo Mode
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
