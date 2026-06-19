const CATEGORY_STYLES = {
  food: { icon: '🍔', color: 'bg-orange-100 text-orange-700' },
  travel: { icon: '🚗', color: 'bg-blue-100 text-blue-700' },
  shopping: { icon: '🛒', color: 'bg-purple-100 text-purple-700' },
  bills: { icon: '📄', color: 'bg-red-100 text-red-700' },
  entertainment: { icon: '🎬', color: 'bg-pink-100 text-pink-700' },
  health: { icon: '💊', color: 'bg-teal-100 text-teal-700' },
  education: { icon: '📚', color: 'bg-indigo-100 text-indigo-700' },
  default: { icon: '💰', color: 'bg-emerald-100 text-emerald-700' },
}

export function getCategoryStyle(name) {
  const key = name?.toLowerCase() ?? ''
  for (const [category, style] of Object.entries(CATEGORY_STYLES)) {
    if (key.includes(category)) return style
  }
  return CATEGORY_STYLES.default
}

export const CHART_COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899']
