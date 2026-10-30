import { useCallback, useState } from 'react'
import { AppProvider } from '@/store/AppContext'
import AppShell from '@/components/layout/AppShell'
import Dashboard from '@/pages/Dashboard'
import TransactionModal from '@/components/ui/TransactionModal'

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <AppProvider>
      <AppShell onNewTransaction={openModal}>
        <Dashboard onNewTransaction={openModal} />
      </AppShell>
      <TransactionModal open={modalOpen} onClose={closeModal} />
    </AppProvider>
  )
}

export default App
