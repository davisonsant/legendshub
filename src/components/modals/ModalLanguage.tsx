import { useState } from 'react'
import { useAppStore } from '@/store'
import Modal, { ModalClose } from '@/components/ui/Modal'
import { translations, type LangCode } from '@/lib/i18n'
import { FLAGS } from '@/lib/flags'
import { Icons } from '@/lib/icons'

const LANGS: { code: LangCode; name: string; flagKey: string; label: string }[] = [
  { code:'pt', name:'Português\n(Brasil)', flagKey:'PT', label:'PT' },
  { code:'en', name:'English',            flagKey:'EN', label:'EN' },
  { code:'es', name:'Español',            flagKey:'ES', label:'ES' },
  { code:'fr', name:'Français',           flagKey:'FR', label:'FR' },
  { code:'de', name:'Deutsch',            flagKey:'DE', label:'DE' },
  { code:'ja', name:'日本語',             flagKey:'JA', label:'JA' },
  { code:'ru', name:'Русский',            flagKey:'RU', label:'RU' },
]

interface Props { onboarding?: boolean }

export default function ModalLanguage({ onboarding }: Props) {
  const { updateSettings, completeLanguageSetup, closeModal, settings } = useAppStore()
  const [selected, setSelected] = useState<LangCode>((settings.language as LangCode) || 'pt')
  const t = translations[selected] ?? translations.pt

  const handleConfirm = () => {
    updateSettings({ language: selected })
    if (onboarding) completeLanguageSetup()
    else closeModal()
  }

  return (
    <Modal maxWidth="640px">
      <ModalClose onClose={onboarding ? undefined : closeModal} />

      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{ background:'rgba(97,95,255,0.15)',border:'1px solid rgba(97,95,255,0.3)',color:'#a09dff' }}>
          {Icons.globe(11)}
          {t.lang.badge}
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-3xl uppercase tracking-[3px] text-white">{t.lang.title}</h2>
        <p className="text-xs text-white/35 uppercase tracking-widest mt-2">{t.lang.sub}</p>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-3">
        {LANGS.slice(0,5).map(l => (
          <LangCard key={l.code} lang={l} selected={selected===l.code} onSelect={()=>setSelected(l.code)} />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-3 mb-6">
        {LANGS.slice(5).map(l => (
          <LangCard key={l.code} lang={l} selected={selected===l.code} onSelect={()=>setSelected(l.code)} />
        ))}
        <div/><div/><div/>
      </div>

      <button className="btn-primary w-full justify-center" onClick={handleConfirm}>
        {Icons.check(14)} {t.lang.confirm}
      </button>
    </Modal>
  )
}

function LangCard({ lang, selected, onSelect }: {
  lang: { code: LangCode; name: string; flagKey: string; label: string }
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button onClick={onSelect}
      className="relative flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl cursor-pointer transition-all border-none"
      style={{
        background: selected ? 'rgba(97,95,255,0.15)' : 'rgba(255,255,255,0.03)',
        border: `2px solid ${selected ? '#615fff' : 'rgba(255,255,255,0.08)'}`,
      }}>
      {selected && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background:'#615fff' }}>
          {Icons.check(9)}
        </span>
      )}
      {/* Real flag image */}
      <img
        src={FLAGS[lang.flagKey]}
        alt={lang.label}
        style={{ width:52, height:38, borderRadius:10, objectFit:'cover', boxShadow:'0 2px 8px rgba(0,0,0,0.45)', display:'block' }}
      />
      <span className="text-xs font-semibold text-white text-center leading-tight whitespace-pre-line">{lang.name}</span>
      <span className="text-[9px] font-bold tracking-widest" style={{ color: selected ? '#a09dff' : 'rgba(97,95,255,0.6)' }}>{lang.label}</span>
    </button>
  )
}
