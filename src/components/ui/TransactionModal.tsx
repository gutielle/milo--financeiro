import { useEffect, useRef, useState } from 'react'
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import type { TransactionType, PaymentMethod, Recurrence } from '@/types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, RECURRENCE_OPTIONS } from '@/data/categories'
import { useApp } from '@/store/AppContext'
import { formatCurrencyInput, parseCurrencyString, getPaymentEmoji } from '@/utils/formatters'
import { getTodayISO } from '@/utils/date'

interface Props {
  open: boolean
  onClose: () => void
}

export default function TransactionModal({ open, onClose }: Props) {
  const { addTransaction } = useApp()
  const [type, setType] = useState<TransactionType>('expense')
  const [amountInput, setAmountInput] = useState('')
  const [categoryId, setCategoryId] = useState<string>(EXPENSE_CATEGORIES[0].id)
  const [description, setDescription] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [date, setDate] = useState<string>(getTodayISO())
  const [recurrence, setRecurrence] = useState<Recurrence>('none')
  const valueRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!open) return
    setType('expense')
    setAmountInput('')
    setCategoryId(EXPENSE_CATEGORIES[0].id)
    setDescription('')
    setPaymentMethod('pix')
    setDate(getTodayISO())
    setRecurrence('none')
    setTimeout(() => {
      valueRef.current?.focus()
    }, 50)
  }, [open])

  useEffect(() => {
    const catList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    if (!catList.some(c => c.id === categoryId)) {
      setCategoryId(catList[0].id)
    }
  }, [type, categoryId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
      }
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const primaryColor = type === 'income' ? 'success' : 'danger'

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmountInput(formatCurrencyInput(e.target.value))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseCurrencyString(amountInput)
    if (!amount || amount <= 0) {
      valueRef.current?.focus()
      return
    }
    addTransaction({
      type,
      amount,
      categoryId,
      description: description.trim() || undefined,
      paymentMethod,
      date,
      recurrence,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl animate-scale-in max-h-[92vh] overflow-y-auto scrollbar-thin">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 flex items-center justify-between sm:rounded-t-2xl rounded-t-3xl z-10">
            <h2 className="text-lg font-bold text-neutral-900">Nova Transação</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="w-9 h-9 -mr-2 rounded-lg inline-flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`relative inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  type === 'expense'
                    ? 'bg-white text-danger shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <ArrowDownCircle className="w-4 h-4" />
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`relative inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  type === 'income'
                    ? 'bg-white text-success shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                Receita
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Valor</label>
              <div
                className={`relative rounded-xl border focus-within:ring-4 transition
                  ${primaryColor === 'success'
                    ? 'border-success/30 bg-success-light focus-within:ring-success/20 focus-within:border-success'
                    : 'border-danger/30 bg-danger-light focus-within:ring-danger/20 focus-within:border-danger'
                  }`}
              >
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold tabular-nums ${
                  primaryColor === 'success' ? 'text-success' : 'text-danger'
                }`}>
                  R$
                </span>
                <input
                  ref={valueRef}
                  type="text"
                  inputMode="decimal"
                  value={amountInput}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  className="w-full pl-16 pr-4 py-4 bg-transparent text-right text-3xl font-bold text-neutral-900 tabular-nums focus:outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Categoria</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => {
                  const active = cat.id === categoryId
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition border
                        ${active
                          ? 'border-transparent shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
                        }`}
                      style={
                        active
                          ? { backgroundColor: `${cat.color}18`, color: cat.color, borderColor: `${cat.color}30` }
                          : undefined
                      }
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        {cat.emoji}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">
                Descrição <span className="text-neutral-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Almoço no Paulista com a galera"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Forma de Pagamento</label>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map(m => {
                  const active = m.value === paymentMethod
                  return (
                    <button
                      type="button"
                      key={m.value}
                      onClick={() => setPaymentMethod(m.value as PaymentMethod)}
                      className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-xs font-semibold transition border
                        ${active
                          ? 'bg-primary-light border-primary/30 text-primary shadow-sm'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                    >
                      <span className="text-xl" aria-hidden>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">Recorrência</label>
                <select
                  value={recurrence}
                  onChange={e => setRecurrence(e.target.value as Recurrence)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  {RECURRENCE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-5 py-4 flex items-center gap-2 sm:rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-[2] py-3 rounded-xl text-sm font-bold text-white shadow-sm hover:shadow-md active:scale-[0.99] transition ${
                primaryColor === 'success' ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              Salvar Transação · {getPaymentEmoji(paymentMethod)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
