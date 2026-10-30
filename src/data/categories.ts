import type { Category } from '@/types'

export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'housing',
    name: 'Moradia',
    emoji: '🏠',
    type: 'expense',
    color: '#0F52BA',
    budgetLimit: 2975,
  },
  {
    id: 'transport',
    name: 'Transporte',
    emoji: '🚗',
    type: 'expense',
    color: '#8B5CF6',
    budgetLimit: 1275,
  },
  {
    id: 'food',
    name: 'Alimentação',
    emoji: '🍔',
    type: 'expense',
    color: '#F59E0B',
    budgetLimit: 1700,
  },
  {
    id: 'health',
    name: 'Saúde',
    emoji: '💼',
    type: 'expense',
    color: '#EF4444',
    budgetLimit: 850,
  },
  {
    id: 'leisure',
    name: 'Lazer',
    emoji: '🎉',
    type: 'expense',
    color: '#EC4899',
    budgetLimit: 850,
  },
  {
    id: 'personal',
    name: 'Pessoal',
    emoji: '👕',
    type: 'expense',
    color: '#14B8A6',
    budgetLimit: 680,
  },
  {
    id: 'subscriptions',
    name: 'Assinaturas',
    emoji: '📱',
    type: 'expense',
    color: '#6366F1',
    budgetLimit: 425,
  },
  {
    id: 'debts',
    name: 'Dívidas',
    emoji: '💳',
    type: 'expense',
    color: '#78716C',
    budgetLimit: 850,
  },
  {
    id: 'education',
    name: 'Educação',
    emoji: '📚',
    type: 'expense',
    color: '#3B82F6',
    budgetLimit: 425,
  },
  {
    id: 'other_expense',
    name: 'Outros',
    emoji: '💸',
    type: 'expense',
    color: '#6B7280',
    budgetLimit: 250,
  },
]

export const INCOME_CATEGORIES: Category[] = [
  {
    id: 'salary',
    name: 'Salário',
    emoji: '💰',
    type: 'income',
    color: '#10B981',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    emoji: '💻',
    type: 'income',
    color: '#22C55E',
  },
  {
    id: 'investment',
    name: 'Investimentos',
    emoji: '📈',
    type: 'income',
    color: '#06B6D4',
  },
  {
    id: 'bonus',
    name: 'Bônus / 13º',
    emoji: '🎁',
    type: 'income',
    color: '#A855F7',
  },
  {
    id: 'other_income',
    name: 'Outros',
    emoji: '💵',
    type: 'income',
    color: '#84CC16',
  },
]

export const ALL_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
]

export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find(c => c.id === id)
}

export const PAYMENT_METHODS: { value: string; label: string; emoji: string }[] = [
  { value: 'pix', label: 'Pix', emoji: '💸' },
  { value: 'credit', label: 'Cartão de Crédito', emoji: '💳' },
  { value: 'debit', label: 'Cartão de Débito', emoji: '💳' },
  { value: 'cash', label: 'Dinheiro', emoji: '💵' },
  { value: 'boleto', label: 'Boleto', emoji: '🧾' },
  { value: 'transfer', label: 'Transferência', emoji: '🏦' },
]

export const RECURRENCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'none', label: 'Não recorrente' },
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
]
