import {
  LayoutDashboard,
  Receipt,
  Plus,
  BarChart3,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Item {
  id: string
  icon: LucideIcon
  label: string
  active?: boolean
  soon?: boolean
}

const ITEMS: Item[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Início', active: true },
  { id: 'transactions', icon: Receipt, label: 'Extrato' },
  { id: 'fab', icon: Plus, label: 'Novo' },
  { id: 'reports', icon: BarChart3, label: 'Relatórios', soon: true },
  { id: 'profile', icon: User, label: 'Perfil', soon: true },
]

interface Props {
  onNewTransaction: () => void
}

export default function BottomNav({ onNewTransaction }: Props) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-200 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {ITEMS.map(item => {
          const Icon = item.icon
          const isFab = item.id === 'fab'
          if (isFab) {
            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  aria-label={item.label}
                  onClick={onNewTransaction}
                  className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-95 transition"
                >
                  <Plus className="w-7 h-7" strokeWidth={2.5} />
                </button>
              </li>
            )
          }
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={item.soon}
                className={`w-full h-16 flex flex-col items-center justify-center gap-0.5 text-xs transition
                  ${item.active
                    ? 'text-primary'
                    : item.soon
                      ? 'text-neutral-300'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
              >
                <Icon className={`w-5 h-5 ${item.active ? 'stroke-[2.2]' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
