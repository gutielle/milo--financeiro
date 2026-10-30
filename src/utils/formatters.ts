export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCurrencyPlain(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function parseCurrencyString(input: string): number {
  const digits = input.replace(/\D/g, '')
  const cents = Number(digits)
  if (!cents) return 0
  return cents / 100
}

export function formatCurrencyInput(input: string): string {
  const rawValue = parseCurrencyString(input)
  return formatCurrencyPlain(rawValue)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0).replace('.', ',')}%`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getPaymentLabel(method: string): string {
  const map: Record<string, string> = {
    pix: 'Pix',
    credit: 'Crédito',
    debit: 'Débito',
    cash: 'Dinheiro',
    boleto: 'Boleto',
    transfer: 'Transferência',
  }
  return map[method] || method
}

export function getPaymentEmoji(method: string): string {
  const map: Record<string, string> = {
    pix: '💸',
    credit: '💳',
    debit: '💳',
    cash: '💵',
    boleto: '🧾',
    transfer: '🏦',
  }
  return map[method] || '💳'
}

export function formatDeltaPercent(current: number, previous: number): {
  value: string
  positive: boolean
  neutral: boolean
} {
  if (previous === 0) {
    return { value: '—', positive: false, neutral: true }
  }
  const delta = ((current - previous) / previous) * 100
  const positive = delta >= 0
  const signal = positive ? '+' : ''
  return {
    value: `${signal}${delta.toFixed(0).replace('.', ',')}%`,
    positive,
    neutral: false,
  }
}
