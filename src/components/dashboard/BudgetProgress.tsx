import { useApp } from '@/store/AppContext'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { getBudgetStatusColor } from '@/utils/finance'

export default function BudgetProgress() {
  const { budgetItems } = useApp()

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Orçamento do Mês</h3>
          <p className="text-xs text-neutral-500 mt-1">Progresso por categoria</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <LegendDot color="bg-success" label="≤ 70%" />
          <LegendDot color="bg-warning" label="71-90%" />
          <LegendDot color="bg-danger" label="&gt; 90%" />
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 scrollbar-thin max-h-[360px]">
        {budgetItems.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-8">Sem dados de orçamento</p>
        ) : (
          budgetItems.map(item => {
            const status = getBudgetStatusColor(item.percentage)
            const displayPct = Math.min(item.percentage, 100)
            return (
              <div key={item.category.id} className="group">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg leading-none shrink-0" aria-hidden>
                      {item.category.emoji}
                    </span>
                    <span className="font-medium text-neutral-800 truncate">
                      {item.category.name}
                    </span>
                    {status.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-danger text-white font-bold uppercase tracking-wide">
                        {status.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 tabular-nums ml-2">
                    <span className="text-sm font-semibold text-neutral-900">
                      {formatCurrency(item.spent)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {' / '}
                      {formatCurrency(item.limit)}
                    </span>
                  </div>
                </div>

                <div className={`relative h-2.5 rounded-full ${status.bg} overflow-hidden`}>
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${status.bar} transition-all duration-700 ease-out`}
                    style={{ width: `${displayPct}%` }}
                  />
                </div>

                <div className={`mt-1 text-[11px] font-semibold tabular-nums ${status.text} text-right`}>
                  {formatPercent(item.percentage)}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-neutral-500">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      {label}
    </span>
  )
}
