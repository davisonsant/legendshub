import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { clsx } from 'clsx'
import { Icons } from '@/lib/icons'

interface ModalProps {
  children: React.ReactNode
  onClose?: () => void
  maxWidth?: string
  className?: string
  noPadding?: boolean
}

// Backdrop starts below navbar (66px) so navbar stays visible
export default function Modal({ children, onClose, maxWidth = '560px', className, noPadding }: ModalProps) {
  const { closeModal } = useAppStore()
  const handleClose = onClose ?? closeModal

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        className={clsx('modal-card', !noPadding && 'p-8', className)}
        style={{ maxWidth, width: '96%' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalClose({ onClose }: { onClose?: () => void }) {
  const { closeModal } = useAppStore()
  const handleClose = onClose ?? closeModal
  return (
    <button
      onClick={handleClose}
      className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-all border-none cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color='#fff' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)' }}
    >
      {Icons.x(14)}
    </button>
  )
}
