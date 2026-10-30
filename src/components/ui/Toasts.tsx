import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useApp } from '@/store/AppContext'

export default function Toasts() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onClose={() => dismissToast(t.id)} />
      ))}
    </div>
  )
}

function Toast({
  toast,
  onClose,
}: {
  toast: { id: string; type: 'success' | 'error' | 'info'; message: string }
  onClose: () => void
}) {
  const styles = {
    success: {
      wrapper: 'bg-success text-white shadow-lg shadow-success/20',
      Icon: CheckCircle2,
    },
    error: {
      wrapper: 'bg-danger text-white shadow-lg shadow-danger/20',
      Icon: AlertCircle,
    },
    info: {
      wrapper: 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/20',
      Icon: Info,
    },
  }[toast.type]

  const Icon = styles.Icon

  return (
    <button
      type="button"
      onClick={onClose}
      className={`pointer-events-auto animate-toast-in min-w-[260px] max-w-[360px] ${styles.wrapper} px-4 py-3 rounded-xl flex items-center gap-3 text-left`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
    </button>
  )
}
