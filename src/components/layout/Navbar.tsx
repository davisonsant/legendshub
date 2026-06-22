import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { useT } from '@/lib/i18n'
import { LANG_TO_FLAG } from '@/lib/flags'
import { Icons } from '@/lib/icons'

export default function Navbar() {
  const { openModal, isLoggedIn, username, settings } = useAppStore()
  const t = useT()
  const [time, setTime] = useState('')
  const [activeTab, setActiveTab] = useState('play')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime([now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join(':'))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const navItems = [
    { id:'play',     label:t.nav.play,     icon:Icons.play(13) },
    { id:'career',   label:t.nav.career,   icon:Icons.saves(13), onClick:()=>openModal('career') },
    { id:'editor',   label:t.nav.editor,   icon:Icons.editor(13), badge:'NEW', onClick:()=>openModal('editor') },
    { id:'settings', label:t.nav.settings, icon:Icons.settings(13), onClick:()=>openModal('settings') },
  ]

  const currentFlag = LANG_TO_FLAG[settings.language] ?? LANG_TO_FLAG['pt']
  const currentLangLabel = settings.language.toUpperCase()

  return (
    <header className="relative z-30 flex-shrink-0">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:'linear-gradient(to bottom,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.60) 35%,rgba(0,0,0,0.25) 65%,transparent 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background:'linear-gradient(to right,transparent,rgba(97,95,255,.35),transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-px"
        style={{ background:'linear-gradient(to right,transparent,rgba(255,255,255,.07) 20%,rgba(255,255,255,.07) 80%,transparent)' }} />

      <div className="relative flex items-center gap-5 px-12 h-[66px]">
        <div className="flex-shrink-0 flex items-center relative">
          <div className="absolute inset-[-8px] rounded-lg blur-2xl opacity-60" style={{ background:'rgba(97,95,255,0.15)' }} />
          <span className="relative font-display font-bold text-2xl tracking-widest text-white">
            LEGENDS<span style={{ color:'#615fff' }}>HUB</span>
          </span>
        </div>

        <div className="w-px h-8" style={{ background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.15),transparent)' }} />

        <nav className="flex items-center gap-0.5">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => { setActiveTab(item.id); item.onClick?.() }}
              className="relative flex items-center gap-1.5 px-4 py-2 font-display font-bold text-[11px] uppercase tracking-widest border-none bg-transparent cursor-pointer transition-colors"
              style={{ color: activeTab===item.id ? '#fff' : 'rgba(255,255,255,0.45)' }}>
              {item.icon}
              {item.label}
              {item.badge && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background:'rgba(97,95,255,0.25)',color:'#a09dff',border:'1px solid rgba(97,95,255,0.4)' }}>
                  {item.badge}
                </span>
              )}
              {activeTab===item.id && (
                <span className="absolute inset-x-2 bottom-[-4px] h-[3px] rounded-full"
                  style={{ background:'linear-gradient(to right,#615fff,#9b8fff)',boxShadow:'0 0 12px rgba(97,95,255,0.6)' }} />
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/[0.08] text-[10px] font-mono tracking-widest text-white/35">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {time}
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono text-white relative cursor-pointer"
            style={{ background:'rgba(97,95,255,0.15)',border:'1px solid rgba(97,95,255,0.45)' }}>
            v0.1
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#05070d] animate-pulse" style={{ background:'#615fff' }} />
          </div>

          {/* Language button with real flag */}
          <button onClick={() => openModal('language')}
            className="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer border-none transition-colors hover:bg-white/10"
            style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.12)' }}>
            <img src={currentFlag} alt={currentLangLabel}
              style={{ width:22,height:16,borderRadius:4,objectFit:'cover',flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,0.4)' }} />
            <span className="text-[10px] font-mono text-white/80">{currentLangLabel}</span>
            {Icons.chevronDown(10)}
          </button>

          <div className="w-px h-7 mx-1 bg-white/10" />

          {isLoggedIn ? (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer"
              style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background:'linear-gradient(135deg,#615fff,#9b8fff)' }}>
                {username?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <div className="text-[11px] text-white/90 font-medium leading-tight">{username}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-wide">player</div>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => openModal('auth-login')} className="btn-secondary text-[11px]" style={{ padding:'7px 14px' }}>
                {Icons.login(12)} {t.login}
              </button>
              <button onClick={() => openModal('auth-signup')} className="btn-primary text-[11px]" style={{ padding:'7px 14px' }}>
                {Icons.userPlus(12)} {t.signup}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
