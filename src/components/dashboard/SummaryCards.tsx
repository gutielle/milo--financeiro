import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useApp } from '@/store/AppContext'
import { formatCurrency, formatDeltaPercent } from '@/utils/formatters'

interface CardProps {
  title: string
  icon: React.ReactNode
  value: number
  iconBg: string
  iconColor: string
  valueColor: string
  deltaCurrent: number
  deltaPrevious: number
  deltaInverted?: boolean
  pulse?: boolean
}

export default function SummaryCards() {
  const { summary } = useApp()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <SummaryCard
        title="Saldo do Mês"
        icon={<Wallet className="w-5 h-5" />}
        value={summary.balance}
        iconBg="bg-primary-light"
        iconColor="text-primary"
        valueColor={summary.balance >= 0 ? 'text-success' : 'text-danger'}
        deltaCurrent={summary.balance}
        deltaPrevious={summary.prevMonth.balance}
        pulse
      />
      <SummaryCard
        title="Receitas"
        icon={<ArrowUpCircle className="w-5 h-5" />}
        value={summary.income}
        iconBg="bg-success-light"
        iconColor="text-success"
        valueColor="text-success"
        deltaCurrent={summary.income}
        deltaPrevious={summary.prevMonth.income}
      />
      <SummaryCard
        title="Despesas"
        icon={<ArrowDownCircle className="w-5 h-5" />}
        value={summary.expense}
        iconBg="bg-danger-light"
        iconColor="text-danger"
        valueColor="text-danger"
        deltaCurrent={summary.expense}
        deltaPrevious={summary.prevMonth.expense}
        deltaInverted
      />
    </div>
  )
}

function SummaryCard({
  title,
  icon,
  value,
  iconBg,
  iconColor,
  valueColor,
  deltaCurrent,
  deltaPrevious,
  deltaInverted,
  pulse,
}: CardProps) {
  const [pulsed, setPulsed] = useState(false)
  const delta = formatDeltaPercent(deltaCurrent, deltaPrevious)
  const deltaPositive = deltaInverted ? !delta.positive : delta.positive

  useEffect(() => {
    if (!pulse) return
    setPulsed(true)
    const t = setTimeout(() => setPulsed(false), 700)
    return () => clearTimeout(t)
  }, [value, pulse])

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-bold tabular-nums ${valueColor} ${
                pulsed ? 'animate-pulse-value inline-block' : ''
              }`}
            >
              {formatCurrency(value)}
            </span>
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} ${iconColor} shrink-0`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs">
        {delta.neutral ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-neutral-500 font-medium">
            Sem dados anteriores
          </span>
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
                deltaPositive
                  ? 'bg-success-light text-success'
                  : 'bg-danger-light text-danger'
              }`}
            >
              {deltaPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {delta.value}
            </span>
            <span className="text-neutral-500">vs mês anterior</span>
          </>
        )}
      </div>
    </div>
  )
}
