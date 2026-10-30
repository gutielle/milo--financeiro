import { useEffect } from 'react'
import SummaryCards from '@/components/dashboard/SummaryCards'
import ExpensePieChart from '@/components/dashboard/ExpensePieChart'
import BudgetProgress from '@/components/dashboard/BudgetProgress'
import TransactionsList from '@/components/dashboard/TransactionsList'
import { monthName } from '@/utils/date'
import { useApp } from '@/store/AppContext'

interface Props {
  onNewTransaction: () => void
}

export default function Dashboard({ onNewTransaction }: Props) {
  const { selectedDate } = useApp()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        onNewTransaction()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNewTransaction])

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            Visão Geral
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900 capitalize">
            {monthName(selectedDate)}
            <span className="text-neutral-400 font-medium">
              {' '}
              de {selectedDate.getFullYear()}
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Acompanhe seus gastos, receitas e metas de orçamento em tempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-2 text-xs text-neutral-500 bg-white border border-neutral-200 rounded-lg px-3 py-2">
            <kbd className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded bg-neutral-100 border border-neutral-200 text-[10px] font-semibold text-neutral-700 tabular-nums">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded bg-neutral-100 border border-neutral-200 text-[10px] font-semibold text-neutral-700 tabular-nums">
              N
            </kbd>
            <span className="ml-0.5">Nova transação</span>
          </span>
        </div>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        <ExpensePieChart />
        <BudgetProgress />
      </div>

      <TransactionsList />
    </div>
  )
}
