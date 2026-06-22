import { useState } from 'react'
import { useAppStore } from '@/store'
import Modal, { ModalClose } from '@/components/ui/Modal'
import { useT } from '@/lib/i18n'
import { Icons } from '@/lib/icons'

const SLIDE_ICONS = [
  Icons.gamepad(32),
  Icons.trophy(32),
  Icons.folder(32),
  Icons.users(32),
]

export default function ModalWelcome() {
  const { completeWelcome, closeModal } = useAppStore()
  const t = useT()
  const [cur, setCur] = useState(0)
  const slides = [t.welcome.slide1, t.welcome.slide2, t.welcome.slide3, t.welcome.slide4]
  const isLast = cur === slides.length - 1

  const handleNext = () => { if (isLast) { completeWelcome(); closeModal() } else setCur(c => c+1) }
  const handleSkip = () => { completeWelcome(); closeModal() }

  return (
    <Modal maxWidth="400px">
      <ModalClose onClose={handleSkip} />

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {slides.map((_,i) => (
          <span key={i} className="rounded-full transition-all duration-300" style={{
            width: i===cur ? 28 : 8, height: 4,
            background: i===cur ? '#615fff' : i<cur ? 'rgba(97,95,255,0.4)' : 'rgba(255,255,255,0.12)',
            boxShadow: i===cur ? '0 0 8px rgba(97,95,255,0.6)' : undefined,
          }} />
        ))}
      </div>

      {/* Icon — SVG, no emoji */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#615fff]"
        style={{ background:'rgba(97,95,255,0.1)',border:'1px solid rgba(97,95,255,0.2)' }}>
        {SLIDE_ICONS[cur]}
      </div>

      <h3 className="font-display font-bold text-xl text-white text-center mb-2.5">{slides[cur].title}</h3>
      <p className="text-sm text-white/50 text-center leading-relaxed max-w-[280px] mx-auto">{slides[cur].desc}</p>

      <div className="flex items-center justify-center gap-4 mt-7">
        <button onClick={handleSkip}
          className="text-[11px] font-display font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer">
          {t.skip}
        </button>
        <button className="btn-primary" onClick={handleNext}>
          {isLast ? t.start : t.next}
          {Icons.arrowRight(13)}
        </button>
      </div>

      <div className="text-center text-[11px] text-white/20 mt-3 tracking-wide">{cur+1} / {slides.length}</div>
    </Modal>
  )
}
