import {
  LayoutDashboard,
  Receipt,
  FolderKanban,
  BarChart3,
  Target,
  Settings,
  HelpCircle,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  label: string
  id: string
  active?: boolean
  soon?: boolean
}

const MAIN_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
  { id: 'transactions', icon: Receipt, label: 'Transações' },
  { id: 'categories', icon: FolderKanban, label: 'Categorias' },
  { id: 'reports', icon: BarChart3, label: 'Relatórios', soon: true },
  { id: 'goals', icon: Target, label: 'Metas', soon: true },
]

const SECONDARY_ITEMS: NavItem[] = [
  { id: 'settings', icon: Settings, label: 'Configurações', soon: true },
  { id: 'help', icon: HelpCircle, label: 'Ajuda', soon: true },
]

interface Props {
  onNewTransaction?: () => void
}

export default function Sidebar({ onNewTransaction }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-neutral-200 h-screen sticky top-0">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-neutral-200">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-neutral-900">Gastos Pessoais</div>
          <div className="text-xs text-neutral-500">Controle Financeiro</div>
        </div>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={onNewTransaction}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-dark hover:shadow-md active:scale-[0.98] transition"
        >
          <span className="text-lg leading-none">+</span>
          Nova Transação
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="text-xs font-medium text-neutral-400 px-3 py-2 uppercase tracking-wide">
          Principal
        </div>
        {MAIN_ITEMS.map(item => (
          <NavLink key={item.id} item={item} />
        ))}

        <div className="text-xs font-medium text-neutral-400 px-3 py-2 mt-6 uppercase tracking-wide">
          Sistema
        </div>
        {SECONDARY_ITEMS.map(item => (
          <NavLink key={item.id} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-semibold text-neutral-900 truncate">Costa</div>
            <div className="text-xs text-neutral-500 truncate">Plano pessoal</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  const isSoon = !!item.soon
  return (
    <button
      type="button"
      disabled={isSoon && !item.active}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group
        ${item.active
          ? 'bg-primary text-white shadow-sm'
          : isSoon
            ? 'text-neutral-400 cursor-not-allowed'
            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${item.active ? '' : isSoon ? 'group-hover:translate-x-0' : ''}`} />
      <span className="flex-1 text-left">{item.label}</span>
      {isSoon && !item.active && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
          breve
        </span>
      )}
    </button>
  )
}
