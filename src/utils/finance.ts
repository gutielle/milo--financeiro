import type { Transaction, MonthlySummary, BudgetItem, Category } from '@/types'
import { EXPENSE_CATEGORIES } from '@/data/categories'

export function calculateMonthlySummary(
  currentMonthTransactions: Transaction[],
  prevMonthTransactions: Transaction[]
): MonthlySummary {
  const income = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const prevIncome = prevMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const prevExpense = prevMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const byCategory: Record<string, number> = {}
  currentMonthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount
    })

  return {
    income,
    expense,
    balance: income - expense,
    byCategory,
    prevMonth: {
      income: prevIncome,
      expense: prevExpense,
      balance: prevIncome - prevExpense,
    },
  }
}

export function calculateBudgetItems(
  byCategory: Record<string, number>
): BudgetItem[] {
  return EXPENSE_CATEGORIES
    .filter(cat => cat.budgetLimit && cat.budgetLimit > 0)
    .map(cat => {
      const spent = byCategory[cat.id] || 0
      const limit = cat.budgetLimit || 0
      const percentage = limit > 0 ? Math.min((spent / limit) * 100, 999) : 0
      return { category: cat, spent, limit, percentage }
    })
    .sort((a, b) => b.percentage - a.percentage)
}

export function getBudgetStatusColor(percentage: number): {
  bar: string
  bg: string
  text: string
  badge?: string
} {
  if (percentage >= 100) {
    return {
      bar: 'bg-danger',
      bg: 'bg-danger-light',
      text: 'text-danger',
      badge: 'ESTOURADO',
    }
  }
  if (percentage >= 90) {
    return {
      bar: 'bg-danger',
      bg: 'bg-danger-light',
      text: 'text-danger',
    }
  }
  if (percentage >= 70) {
    return {
      bar: 'bg-warning',
      bg: 'bg-warning-light',
      text: 'text-warning',
    }
  }
  return {
    bar: 'bg-success',
    bg: 'bg-success-light',
    text: 'text-success',
  }
}

export function getRandomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function groupTransactionsForPieChart(
  transactions: Transaction[],
  getCategory: (id: string) => Category | undefined
) {
  const map: Record<string, { value: number; label: string; color: string; emoji: string }> = {}

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const cat = getCategory(t.categoryId)
      if (!cat) return
      if (!map[cat.id]) {
        map[cat.id] = {
          value: 0,
          label: `${cat.emoji} ${cat.name}`,
          color: cat.color,
          emoji: cat.emoji,
        }
      }
      map[cat.id].value += t.amount
    })

  const entries = Object.values(map).sort((a, b) => b.value - a.value)
  return {
    labels: entries.map(e => e.label),
    data: entries.map(e => e.value),
    colors: entries.map(e => e.color),
    raw: entries,
  }
}
