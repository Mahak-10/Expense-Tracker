const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
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

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }
  return response.text()
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

export { API_BASE }
