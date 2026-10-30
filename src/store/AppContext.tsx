import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Transaction, ToastMessage } from '@/types'
import { MOCK_TRANSACTIONS } from '@/data/mockTransactions'
import { getRandomId } from '@/utils/finance'
import { filterTransactionsByMonth } from '@/utils/date'
import { calculateMonthlySummary, calculateBudgetItems, groupTransactionsForPieChart } from '@/utils/finance'
import { getCategoryById } from '@/data/categories'

interface AppContextState {
  transactions: Transaction[]
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void
  updateTransaction: (id: string, tx: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  currentMonthTx: Transaction[]
  prevMonthTx: Transaction[]
  summary: ReturnType<typeof calculateMonthlySummary>
  budgetItems: ReturnType<typeof calculateBudgetItems>
  pieChartData: ReturnType<typeof groupTransactionsForPieChart>
  toasts: ToastMessage[]
  pushToast: (t: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void
}

const AppContext = createContext<AppContextState | undefined>(undefined)

const STORAGE_KEY = 'gastos-pessoais:transactions:v1'

function loadInitial(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Transaction[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    /* ignore */
  }
  return MOCK_TRANSACTIONS
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadInitial())
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch {
      /* ignore */
    }
  }, [transactions])

  const pushToast = useCallback((t: Omit<ToastMessage, 'id'>) => {
    const id = getRandomId()
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id))
    }, 2600)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
      const newTx: Transaction = {
        ...tx,
        id: getRandomId(),
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setTransactions(prev => [newTx, ...prev])
      pushToast({ type: 'success', message: 'Transação salva com sucesso!' })
    },
    [pushToast]
  )

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, ...updates } : t))
      )
      pushToast({ type: 'success', message: 'Transação atualizada!' })
    },
    [pushToast]
  )

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions(prev => prev.filter(t => t.id !== id))
      pushToast({ type: 'success', message: 'Transação removida.' })
    },
    [pushToast]
  )

  const currentMonthTx = useMemo(
    () => filterTransactionsByMonth(transactions, selectedDate),
    [transactions, selectedDate]
  )

  const prevMonthDate = useMemo(() => {
    const d = new Date(selectedDate)
    d.setMonth(d.getMonth() - 1)
    return d
  }, [selectedDate])

  const prevMonthTx = useMemo(
    () => filterTransactionsByMonth(transactions, prevMonthDate),
    [transactions, prevMonthDate]
  )

  const summary = useMemo(
    () => calculateMonthlySummary(currentMonthTx, prevMonthTx),
    [currentMonthTx, prevMonthTx]
  )

  const budgetItems = useMemo(
    () => calculateBudgetItems(summary.byCategory),
    [summary.byCategory]
  )

  const pieChartData = useMemo(
    () => groupTransactionsForPieChart(currentMonthTx, getCategoryById),
    [currentMonthTx]
  )

  const value: AppContextState = {
    transactions,
    selectedDate,
    setSelectedDate,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    currentMonthTx,
    prevMonthTx,
    summary,
    budgetItems,
    pieChartData,
    toasts,
    pushToast,
    dismissToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
