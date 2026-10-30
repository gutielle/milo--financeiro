export type TransactionType = 'income' | 'expense'

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash' | 'boleto' | 'transfer'

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Category {
  id: string
  name: string
  emoji: string
  type: TransactionType
  color: string
  budgetLimit?: number
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  description?: string
  paymentMethod: PaymentMethod
  date: string
  recurrence: Recurrence
  tags?: string[]
  createdAt: string
}

export interface MonthlySummary {
  income: number
  expense: number
  balance: number
  byCategory: Record<string, number>
  prevMonth: {
    income: number
    expense: number
    balance: number
  }
}

export interface BudgetItem {
  category: Category
  spent: number
  limit: number
  percentage: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}
