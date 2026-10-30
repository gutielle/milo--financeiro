import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  isWithinInterval,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Transaction } from '@/types'

export function getMonthRange(date: Date) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function getPrevMonthRange(date: Date) {
  const prev = subMonths(date, 1)
  return {
    start: startOfMonth(prev),
    end: endOfMonth(prev),
  }
}

export function filterTransactionsByMonth(
  transactions: Transaction[],
  date: Date
): Transaction[] {
  const { start, end } = getMonthRange(date)
  return transactions.filter(t => {
    const txDate = parseISO(t.date)
    return isWithinInterval(txDate, { start, end })
  })
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM 'de' yyyy", { locale: ptBR })
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatMonthShort(date: Date): string {
  return format(date, 'MM/yyyy')
}

export function monthName(date: Date): string {
  return format(date, 'MMMM', { locale: ptBR })
}
