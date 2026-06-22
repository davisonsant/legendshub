import { useState } from 'react'
import { useAppStore } from '@/store'
import { FLAGS } from '@/lib/flags'
import { Icons } from '@/lib/icons'
import type { AppTheme, MatchSpeed, Difficulty } from '@/types'

const LANGS_ROW1 = [
  { code:'pt', flagKey:'PT', name:'Português (Brasil)', label:'PT' },
  { code:'en', flagKey:'EN', name:'English',            label:'EN' },
  { code:'es', flagKey:'ES', name:'Español',            label:'ES' },
  { code:'fr', flagKey:'FR', name:'Français',           label:'FR' },
  { code:'de', flagKey:'DE', name:'Deutsch',            label:'DE' },
]
const LANGS_ROW2 = [
  { code:'ja', flagKey:'JA', name:'日本語',  label:'JA' },
  { code:'ru', flagKey:'RU', name:'Русский', label:'RU' },
]

export default function ModalSettings() {
  const { settings, updateSettings, closeModal } = useAppStore()
  const [rejectVal, setRejectVal] = useState(settings.autoRejectThreshold)

  return (
    /* Backdrop starts below navbar */
    <div
      className="fixed z-50 flex items-start justify-center"
      style={{ top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) closeModal() }}
    >
      {/* Card — wide like reference, scrollable, no visible scrollbar */}
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: '700px',
          maxWidth: '94vw',
          maxHeight: 'calc(100vh - 66px - 24px)',
          marginTop: '28px',
          background: 'linear-gradient(160deg,#12151f 0%,#0d1020 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Close btn */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center border-none cursor-pointer z-10 transition-colors"
          style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)' }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.14)';(e.currentTarget as HTMLElement).style.color='#fff'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)'}}
        >
          {Icons.x(14)}
        </button>

        {/* Fixed header */}
        <div className="flex-shrink-0 px-9 pt-8 pb-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[3px] text-white/30 mb-2 font-bold">
            <span>—</span> Menu
          </div>
          <h2 className="font-display font-bold text-[38px] leading-none text-white">Configurações</h2>
          <p className="text-[11px] uppercase tracking-[2px] text-white/25 mt-2">
            Tema · Velocidade · Jogabilidade
          </p>
        </div>

        {/* Scrollable body — hidden scrollbar */}
        <div
          className="flex-1 overflow-y-auto px-9 pb-8"
          style={{ scrollbarWidth:'none' }}
        >
          <style>{`.cfg-scroll::-webkit-scrollbar{display:none}`}</style>

          {/* ── IDIOMA ─────────────────────────────────────────── */}
          <Section label="Idioma" icon={Icons.globe(12)}>
            {/* Row 1: 5 langs */}
            <div className="grid grid-cols-5 gap-2 mb-2">
              {LANGS_ROW1.map(l => (
                <LangCard key={l.code} lang={l}
                  selected={settings.language===l.code}
                  onSelect={()=>updateSettings({ language:l.code })} />
              ))}
            </div>
            {/* Row 2: 2 langs + empty */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {LANGS_ROW2.map(l => (
                <LangCard key={l.code} lang={l}
                  selected={settings.language===l.code}
                  onSelect={()=>updateSettings({ language:l.code })} />
              ))}
              <div/><div/><div/>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-white/25">
                Toda a interface, narrativas e mensagens
              </span>
              <button className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer border-none bg-transparent transition-colors"
                style={{ color:'#615fff' }}>
                <img
                  src={FLAGS[(settings.language.toUpperCase()) as keyof typeof FLAGS] ?? FLAGS.PT}
                  alt=""
                  style={{ width:16, height:11, borderRadius:3, objectFit:'cover' }}
                />
                Trocar idioma
              </button>
            </div>
          </Section>

          {/* ── APARÊNCIA ──────────────────────────────────────── */}
          <Section label="Aparência" icon={Icons.sun(12)}>
            <div className="grid grid-cols-3 gap-3">
              {([
                ['light',  Icons.sun(14),     'Claro',   'FootSim limpo'],
                ['dark',   Icons.moon(14),    'Escuro',  'Reduz fadiga ocular'],
                ['system', Icons.monitor(14), 'Sistema', 'Segue o SO'],
              ] as const).map(([val, icon, title, sub]) => (
                <button key={val}
                  onClick={()=>updateSettings({ theme:val as AppTheme })}
                  className="p-3.5 rounded-lg cursor-pointer border-none text-left transition-all"
                  style={{
                    background: settings.theme===val ? 'rgba(97,95,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${settings.theme===val ? '#615fff' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-0.5">{icon} {title}</div>
                  <div className="text-xs text-white/30">{sub}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* ── VELOCIDADE ─────────────────────────────────────── */}
          <Section label="Velocidade da Partida ao Vivo" icon={Icons.zap(12)}>
            <div className="grid grid-cols-4 gap-2.5">
              {([1,2,4,8] as MatchSpeed[]).map(v => (
                <button key={v}
                  onClick={()=>updateSettings({ matchSpeed:v })}
                  className="py-3 rounded-lg cursor-pointer border-none text-sm font-semibold transition-all flex items-center justify-center gap-1"
                  style={{
                    background: settings.matchSpeed===v ? 'rgba(97,95,255,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${settings.matchSpeed===v ? '#615fff' : 'rgba(255,255,255,0.08)'}`,
                    color: settings.matchSpeed===v ? '#fff' : 'rgba(255,255,255,0.55)',
                  }}>
                  {v}×{v===8 && <span style={{ color:'rgba(255,200,0,0.9)' }}>{Icons.zap(11)}</span>}
                </button>
              ))}
            </div>
          </Section>

          {/* ── DIFICULDADE ────────────────────────────────────── */}
          <Section label="Dificuldade" icon={Icons.target(12)}>
            <div className="grid grid-cols-3 gap-3">
              {([
                ['easy',  'Fácil',   'Orçamento, IA suave'],
                ['normal','Normal',  'Experiência balanceada'],
                ['hard',  'Difícil', 'Patrocínios duros, IA tática'],
              ] as const).map(([val, title, sub]) => (
                <button key={val}
                  onClick={()=>updateSettings({ difficulty:val as Difficulty })}
                  className="p-3.5 rounded-lg cursor-pointer border-none text-left transition-all"
                  style={{
                    background: settings.difficulty===val ? 'rgba(97,95,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${settings.difficulty===val ? '#615fff' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
                  <div className="text-xs text-white/30">{sub}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* ── AUTO-REJEIÇÃO ──────────────────────────────────── */}
          <Section label="Auto-rejeição de Propostas" icon={Icons.undo(12)}>
            <p className="text-[10px] uppercase tracking-wider text-white/25 mb-3">
              Recusa automaticamente ofertas abaixo do % do valor de mercado.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range" min={0} max={100} value={rejectVal}
                onChange={e=>{const v=Number(e.target.value);setRejectVal(v);updateSettings({autoRejectThreshold:v})}}
                className="flex-1 h-1 rounded-full outline-none cursor-pointer"
                style={{ accentColor:'#615fff' }}
              />
              <span className="text-xs font-semibold text-white/50 w-8 text-right min-w-[32px]">
                {rejectVal===0 ? 'Off' : `${rejectVal}%`}
              </span>
            </div>
          </Section>

          {/* ── EXPERIÊNCIA ────────────────────────────────────── */}
          <Section label="Experiência" icon={Icons.star(12)}>
            {[
              { key:'hoverPreview' as const,      label:'Hover preview de jogadores', sub:'Mini-card ao passar o mouse' },
              { key:'keyboardShortcuts' as const, label:'Atalhos de teclado',         sub:'Espaço, J, 1-9...' },
              { key:'accentColor' as const,       label:'Acentos LegendsHub (escuro)',sub:'Detalhes em roxo/lilás' },
            ].map(item => (
              <div key={item.key}
                className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium text-white/90">{item.label}</div>
                  <div className="text-xs text-white/30 mt-0.5">{item.sub}</div>
                </div>
                <label className="relative w-9 h-5 cursor-pointer flex-shrink-0 ml-4">
                  <input type="checkbox" className="sr-only"
                    checked={settings[item.key]}
                    onChange={e=>updateSettings({[item.key]:e.target.checked})} />
                  <span className="block w-full h-full rounded-full transition-colors duration-200"
                    style={{ background:settings[item.key] ? '#615fff' : 'rgba(255,255,255,0.12)' }} />
                  <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform:settings[item.key] ? 'translateX(16px)' : 'translateX(0)' }} />
                </label>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  )
}

/* ── Section wrapper ─────────────────────────────────────────────── */
function Section({ label, icon, children }: { label:string; icon:React.ReactNode; children:React.ReactNode }) {
  return (
    <div className="mb-4 rounded-xl overflow-hidden"
      style={{ border:'1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]"
        style={{
          background: 'rgba(255,255,255,0.03)',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '2.5px', textTransform: 'uppercase',
          color: 'rgba(97,95,255,0.85)',
        }}>
        {icon}{label}
      </div>
      <div className="px-4 py-4" style={{ background:'rgba(255,255,255,0.01)' }}>
        {children}
      </div>
    </div>
  )
}

/* ── Language card ───────────────────────────────────────────────── */
function LangCard({ lang, selected, onSelect }: {
  lang: { code:string; flagKey:string; name:string; label:string }
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button onClick={onSelect}
      className="relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl cursor-pointer border-none transition-all"
      style={{
        background: selected ? 'rgba(97,95,255,0.15)' : 'rgba(255,255,255,0.03)',
        border: `2px solid ${selected ? '#615fff' : 'rgba(255,255,255,0.08)'}`,
      }}>
      {selected && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background:'#615fff' }}>
          {Icons.check(8)}
        </span>
      )}
      <img
        src={FLAGS[lang.flagKey]}
        alt={lang.label}
        style={{ width:48, height:34, borderRadius:8, objectFit:'cover', boxShadow:'0 2px 6px rgba(0,0,0,0.45)', display:'block' }}
      />
      <span className="text-[11px] font-semibold text-white text-center leading-tight">{lang.name}</span>
      <span className="text-[9px] font-bold tracking-widest"
        style={{ color: selected ? '#a09dff' : 'rgba(97,95,255,0.5)' }}>{lang.label}</span>
    </button>
  )
}
