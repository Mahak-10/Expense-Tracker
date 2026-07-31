const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const userId = sessionStorage.getItem('userId')
  const headers = { ...options.headers }
  if (userId) {
    headers['X-User-Id'] = userId
  }
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    let message = text || `Request failed: ${response.status}`
    try {
      const json = JSON.parse(text)
      if (typeof json === 'object' && json !== null) {
        message = Object.values(json).join(', ') || message
      }
    } catch {
      // keep raw text
    }
    throw new Error(message)
  }

  const text = await response.text()
  if (text) {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }
  return null
}

export const authApi = {
  register: (username, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  updateProfile: (username, password) =>
    request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify({ username, password: password || undefined }),
    }),
}

export const expenseApi = {
  getAll: () => request('/expense/get/expenses'),
  add: (data) => request('/expense/add/expense', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/expense/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/expense/delete/expenseid/${id}`, { method: 'DELETE' }),
  deleteAll: () => request('/expense/delete/allexpenses', { method: 'DELETE' }),
  getTotal: () => request('/expense/expenses/total'),
  getMonthwise: () => request('/expense/monthwise'),
  getCategoryTotals: () => request('/expense/category-expenses'),
  getByMonth: (month) => request(`/expense/${month}`),
  getByCategory: (name) => request(`/expense/expense/${name}`),
  getGroupedByCategory: () => request('/expense/expense/category'),
}

export const categoryApi = {
  getAll: () => request('/category/get/categories'),
  add: (data) => request('/category/add/category', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/category/update/category/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/category/delete/id/${id}`, { method: 'DELETE' }),
  deleteAll: () => request('/category/delete/all', { method: 'DELETE' }),
}

export const savingsApi = {
  getAll: () => request('/savings/get/all'),
  add: (data) => request('/savings/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/savings/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/savings/delete/${id}`, { method: 'DELETE' }),
  deleteAll: () => request('/savings/delete/all', { method: 'DELETE' }),
  getSummary: () => request('/savings/summary'),
}

export const debtApi = {
  getAll: () => request('/debts/get/all'),
  add: (data) => request('/debts/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/debts/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/debts/delete/${id}`, { method: 'DELETE' }),
  deleteAll: () => request('/debts/delete/all', { method: 'DELETE' }),
}

export const scheduledApi = {
  getAll: () => request('/scheduled/get/all'),
  add: (data) => request('/scheduled/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/scheduled/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/scheduled/delete/${id}`, { method: 'DELETE' }),
  getOptions: () => request('/scheduled/options'),
  addOption: (data) => request('/scheduled/options/add', { method: 'POST', body: JSON.stringify(data) }),
  deleteOption: (id) => request(`/scheduled/options/delete/${id}`, { method: 'DELETE' }),
}

export const subscriptionApi = {
  getAll: () => request('/subscriptions/get/all'),
  add: (data) => request('/subscriptions/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/subscriptions/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/subscriptions/delete/${id}`, { method: 'DELETE' }),
}

export { API_BASE }
