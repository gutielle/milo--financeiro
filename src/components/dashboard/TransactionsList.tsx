import { useState } from 'react'
import { Search, Filter, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '@/store/AppContext'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getPaymentEmoji,
  getPaymentLabel,
} from '@/utils/formatters'
import { getCategoryById } from '@/data/categories'
import type { Transaction } from '@/types'
import { format } from 'date-fns'

export default function TransactionsList() {
  const { currentMonthTx, deleteTransaction } = useApp()
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = currentMonthTx
    .filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const cat = getCategoryById(t.categoryId)
        return (
          t.description?.toLowerCase().includes(q) ||
          cat?.name.toLowerCase().includes(q) ||
          formatCurrency(t.amount).toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Últimas Transações</h3>
          <p className="text-xs text-neutral-500 mt-1">
            {filtered.length} {filtered.length === 1 ? 'transação' : 'transações'} no mês
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div className="flex items-center gap-0.5 p-0.5 bg-neutral-100 rounded-lg">
            {(['all', 'expense', 'income'] as const).map(k => (
              <button
                key={k}
                type="button"
                onClick={() => setFilterType(k)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition ${
                  filterType === k
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {k === 'all' ? 'Tudo' : k === 'income' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState hasFilter={!!query || filterType !== 'all'} />
      ) : (
        <>
          <DesktopTable
            items={filtered}
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
            onDelete={deleteTransaction}
          />
          <MobileList
            items={filtered}
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
            onDelete={deleteTransaction}
          />
        </>
      )}
    </section>
  )
}

interface TableProps {
  items: Transaction[]
  confirmDelete: string | null
  setConfirmDelete: (id: string | null) => void
  onDelete: (id: string) => void
}

function DesktopTable({ items, confirmDelete, setConfirmDelete, onDelete }: TableProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-100">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Data</th>
            <th className="text-left px-4 py-3">Descrição</th>
            <th className="text-left px-4 py-3">Categoria</th>
            <th className="text-left px-4 py-3">Pagamento</th>
            <th className="text-right px-4 py-3">Valor</th>
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {items.map(tx => {
            const cat = getCategoryById(tx.categoryId)
            const isIncome = tx.type === 'income'
            const valueClass = isIncome ? 'text-success' : 'text-danger'
            const signal = isIncome ? '+ ' : '- '
            return (
              <tr
                key={tx.id}
                className="group hover:bg-neutral-50/60 transition"
              >
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 tabular-nums">
                  {formatDate(tx.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900">
                    {tx.description || 'Sem descrição'}
                  </div>
                  {tx.recurrence !== 'none' && (
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Recorrente · {recurLabel(tx.recurrence)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                    style={cat ? { backgroundColor: `${cat.color}15`, color: cat.color } : undefined}
                  >
                    <span aria-hidden>{cat?.emoji || '💳'}</span>
                    {cat?.name || 'Sem categoria'}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden>{getPaymentEmoji(tx.paymentMethod)}</span>
                    {getPaymentLabel(tx.paymentMethod)}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-semibold tabular-nums whitespace-nowrap ${valueClass}`}>
                  {signal}
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-4 py-3 relative">
                  {confirmDelete === tx.id ? (
                    <div className="flex items-center gap-1 animate-fade-in">
                      <button
                        type="button"
                        onClick={() => onDelete(tx.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-danger text-white text-xs font-medium hover:bg-danger/90"
                      >
                        <Trash2 className="w-3 h-3" />
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium hover:bg-neutral-200"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white border border-neutral-200 rounded-lg shadow-md overflow-hidden">
                      <button
                        type="button"
                        className="w-8 h-8 inline-flex items-center justify-center text-neutral-500 hover:text-primary hover:bg-primary-light"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(tx.id)}
                        className="w-8 h-8 inline-flex items-center justify-center text-neutral-500 hover:text-danger hover:bg-danger-light"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function MobileList({ items, confirmDelete, setConfirmDelete, onDelete }: TableProps) {
  return (
    <div className="md:hidden space-y-2">
      {items.map(tx => {
        const cat = getCategoryById(tx.categoryId)
        const isIncome = tx.type === 'income'
        const valueClass = isIncome ? 'text-success' : 'text-danger'
        const signal = isIncome ? '+ ' : '- '
        return (
          <div
            key={tx.id}
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat?.color || '#6B7280'}15` }}
                  >
                    <span className="text-lg" aria-hidden>
                      {cat?.emoji || '💳'}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-neutral-900 truncate">
                      {tx.description || (cat?.name ?? 'Sem descrição')}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{formatDateTime(tx.date)}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        {getPaymentEmoji(tx.paymentMethod)}
                        {getPaymentLabel(tx.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className={`text-right font-bold tabular-nums ${valueClass}`}>
                  <span className="text-xs">{signal}</span>
                  <span>{formatCurrency(tx.amount)}</span>
                </div>

                {confirmDelete === tx.id ? (
                  <div className="flex items-center gap-1 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => onDelete(tx.id)}
                      className="px-2 py-1 rounded-md bg-danger text-white text-[11px] font-medium"
                    >
                      Apagar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="px-2 py-1 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(confirmDelete === tx.id ? null : tx.id)}
                    className="w-7 h-7 rounded-md inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                    aria-label="Ações"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function recurLabel(r: string) {
  switch (r) {
    case 'daily':
      return 'diária'
    case 'weekly':
      return 'semanal'
    case 'monthly':
      return 'mensal'
    case 'yearly':
      return 'anual'
    default:
      return r
  }
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="py-14 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mb-4">
        <Filter className="w-7 h-7" />
      </div>
      <p className="text-sm font-medium text-neutral-700">
        {hasFilter ? 'Nenhuma transação corresponde à busca' : 'Nenhuma transação esse mês'}
      </p>
      <p className="text-xs text-neutral-500 mt-1">
        {hasFilter
          ? `Lembre-se do formato de data ${format(new Date(), 'dd/MM/yyyy')}`
          : 'Clique em "Nova Transação" para começar'}
      </p>
    </div>
  )
}
