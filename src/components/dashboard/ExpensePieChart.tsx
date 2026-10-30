import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useApp } from '@/store/AppContext'
import { formatCurrency } from '@/utils/formatters'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ExpensePieChart() {
  const { pieChartData, summary } = useApp()

  const data = useMemo(() => {
    return {
      labels: pieChartData.labels,
      datasets: [
        {
          data: pieChartData.data,
          backgroundColor: pieChartData.colors,
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverBorderWidth: 4,
          hoverOffset: 6,
        },
      ],
    }
  }, [pieChartData])

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
          boxWidth: 10,
          font: {
            family: "'Inter', system-ui",
            size: 12,
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { family: "'Inter', system-ui", size: 13, weight: 'bold' as const },
        bodyFont: { family: "'Inter', system-ui", size: 12 },
        padding: 12,
        cornerRadius: 10,
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: ctx => {
            const value = Number(ctx.raw) || 0
            const total = summary.expense || 1
            const pct = ((value / total) * 100).toFixed(0)
            return ` ${formatCurrency(value)} (${pct}%)`
          },
        },
      },
    },
    cutout: '52%',
  }

  const empty = pieChartData.data.length === 0

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Distribuição de Gastos</h3>
          <p className="text-xs text-neutral-500 mt-1">Por categoria no mês</p>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-light text-primary">
          Total {formatCurrency(summary.expense)}
        </span>
      </div>

      <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
        {empty ? (
          <div className="text-center py-10 text-neutral-400">
            <p className="text-sm">Sem despesas esse mês</p>
            <p className="text-xs mt-1">Comece lançando uma nova transação!</p>
          </div>
        ) : (
          <>
            <Pie data={data} options={options} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-neutral-500">Total gasto</span>
              <span className="text-base sm:text-lg font-bold text-neutral-900 tabular-nums mt-0.5">
                {formatCurrency(summary.expense)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
