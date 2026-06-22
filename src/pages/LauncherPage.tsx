import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store'
import { useT } from '@/lib/i18n'
import { Icons } from '@/lib/icons'
import Navbar from '@/components/layout/Navbar'

export default function LauncherPage() {
  const { openModal } = useAppStore()
  const t = useT()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#05070d]">
      {/* Background video */}
      <video ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
        autoPlay muted loop playsInline src="/videos/bg.mp4" />

      {/* Left fade */}
      <div className="absolute inset-y-0 left-0 w-[55%] pointer-events-none z-[2]"
        style={{ background:'linear-gradient(to right,#05070d 0%,rgba(5,7,13,0.72) 55%,transparent 100%)' }} />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-[2]"
        style={{ background:'linear-gradient(to top,rgba(5,7,13,0.95),transparent)' }} />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        {/* Hero — pushed down with padding-top */}
        <main className="flex-1 flex flex-col justify-center px-16 max-w-[58%]" style={{ paddingTop: "10vh" }}>
          <h1 className="font-display font-bold leading-[0.88] tracking-tight"
            style={{ fontSize:'clamp(2.4rem, 5.5vw, 5.4rem)' }}>
            <span className="block text-white/90">{t.heroTitle}</span>
            {/* Worlds in primary purple #615fff */}
            <span className="block mt-1" style={{ color:'#615fff', filter:'drop-shadow(0 4px 20px rgba(97,95,255,0.5))' }}>
              {t.heroHighlight}
            </span>
          </h1>

          <p className="mt-6 text-base text-white/50 leading-relaxed max-w-[480px]">
            {t.heroSub}
          </p>

          {/* CTA */}
          <div className="mt-9">
            <button className="btn-primary font-bold"
              style={{ padding:'16px 34px', fontSize:'13px' }}
              onClick={() => openModal('newCareer')}>
              {Icons.play(16)}
              {t.newCareer}
              {Icons.arrowRight(14)}
            </button>
          </div>

          {/* Secondary links */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <button onClick={() => openModal('editor')}
              className="inline-flex items-center gap-1.5 text-[10.5px] font-display font-bold uppercase tracking-widest transition-colors hover:text-white border-none bg-transparent cursor-pointer"
              style={{ color:'#a09dff' }}>
              {Icons.editor(11)}
              {t.nav.editor}
              <span style={{ background:'rgba(97,95,255,0.25)',color:'#a09dff',fontSize:'8px',padding:'1px 5px',borderRadius:'3px',border:'1px solid rgba(97,95,255,0.4)' }}>
                NEW
              </span>
            </button>
            <span style={{ color:'rgba(255,255,255,0.15)' }}>·</span>
            <button className="text-[10.5px] font-display font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Como jogar
            </button>
            <span style={{ color:'rgba(255,255,255,0.15)' }}>·</span>
            <button className="text-[10.5px] font-display font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Sobre o LegendsHub
            </button>
          </div>

          {/* Sponsors */}
          <div className="mt-10">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.025]">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Patrocinadores</span>
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-wider">
                KGN · VLG · JFC
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FABs */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-full text-white text-xs font-display font-bold uppercase tracking-wide cursor-pointer border-none"
          style={{ background:'linear-gradient(135deg,#d946ef,#a855f7,#6366f1)',boxShadow:'0 12px 30px rgba(168,85,247,.45)' }}>
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">{Icons.heart(13)}</span>
          Apoie o Projeto!
        </button>
        <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-white text-xs font-display font-bold uppercase tracking-wide no-underline border-none"
          style={{ background:'linear-gradient(135deg,#5865f2,#4752c4)',boxShadow:'0 12px 30px rgba(88,101,242,.40)' }}>
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">{Icons.discord(15)}</span>
          Discord
        </a>
      </div>
    </div>
  )
}
