import { useState, type ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Toasts from '@/components/ui/Toasts'

interface Props {
  children: ReactNode
  onNewTransaction: () => void
}

export default function AppShell({ children, onNewTransaction }: Props) {
  const [_mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      <Sidebar onNewTransaction={onNewTransaction} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      <BottomNav onNewTransaction={onNewTransaction} />
      <Toasts />
    </div>
  )
}
