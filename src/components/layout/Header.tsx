import { ChevronLeft, ChevronRight, Menu, Search, User } from 'lucide-react'
import { useApp } from '@/store/AppContext'
import { formatMonthYear } from '@/utils/date'
import { addMonths } from 'date-fns'

interface Props {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: Props) {
  const { selectedDate, setSelectedDate } = useApp()

  const prev = () => setSelectedDate(addMonths(selectedDate, -1))
  const next = () => setSelectedDate(addMonths(selectedDate, 1))

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 -ml-2 inline-flex items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1 px-1">
            <div className="sm:hidden w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold">G$</span>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={prev}
              className="w-8 h-8 inline-flex items-center justify-center rounded-md text-neutral-600 hover:bg-white hover:shadow-sm transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-3 min-w-[150px] sm:min-w-[180px] text-center">
              <span className="text-sm sm:text-base font-semibold text-neutral-900 capitalize tabular-nums">
                {formatMonthYear(selectedDate)}
              </span>
            </div>

            <button
              type="button"
              aria-label="Próximo mês"
              onClick={next}
              className="w-8 h-8 inline-flex items-center justify-center rounded-md text-neutral-600 hover:bg-white hover:shadow-sm transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Buscar transações..."
              className="w-56 pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>

        <button
          type="button"
          aria-label="Perfil do usuário"
          className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-sm shadow-sm hover:shadow-md transition"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
