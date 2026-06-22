import { useState } from 'react'
import { useAppStore } from '@/store'
import Modal, { ModalClose } from '@/components/ui/Modal'
import { useT } from '@/lib/i18n'
import { FLAGS } from '@/lib/flags'
import { Icons } from '@/lib/icons'

interface Props { defaultTab?: 'login' | 'register' }

const COUNTRIES = [
  { code:'br', flagKey:'PT', name:'Brasil' },
  { code:'us', flagKey:'EN', name:'United States' },
  { code:'es', flagKey:'ES', name:'España' },
  { code:'mx', flagKey:'ES', name:'México' },
  { code:'ar', flagKey:'ES', name:'Argentina' },
  { code:'fr', flagKey:'FR', name:'France' },
  { code:'jp', flagKey:'JA', name:'日本' },
  { code:'de', flagKey:'DE', name:'Deutschland' },
]

export default function ModalAuth({ defaultTab='login' }: Props) {
  const { closeModal, openModal } = useAppStore()
  const t = useT()
  const [tab, setTab] = useState<'login'|'register'>(defaultTab)
  const [country, setCountry] = useState('br')
  const [nick, setNick] = useState('')

  return (
    <Modal maxWidth="780px">
      <ModalClose />

      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#615fff]" />
        <span className="text-[10px] font-bold uppercase tracking-[3px] text-white/30">Conta LegendsHub</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-3xl text-white leading-tight">
            {tab==='login' ? 'Entrar na sua conta' : 'Criar sua conta'}
          </h2>
          <p className="text-xs text-white/35 mt-1">
            {tab==='login' ? 'Acesse saves na nuvem, chat global e comunidade.' : 'Nick, e-mail, personagem e país do chat global.'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(['login','register'] as const).map(t2 => (
            <button key={t2} onClick={() => setTab(t2)}
              className="px-6 py-2.5 rounded-lg cursor-pointer border-none font-display font-bold uppercase tracking-wide text-[13px] transition-all"
              style={{
                background: tab===t2 ? '#615fff' : 'rgba(255,255,255,0.06)',
                color:      tab===t2 ? '#fff' : 'rgba(255,255,255,0.5)',
                boxShadow:  tab===t2 ? '0 4px 14px rgba(97,95,255,0.45)' : undefined,
              }}>
              {t2==='login' ? t.login : t.signup}
            </button>
          ))}
        </div>
      </div>

      {/* LOGIN */}
      {tab==='login' && (
        <div className="space-y-4">
          <Field label="Usuário ou E-mail" icon={Icons.user(12)}>
            <input className="lh-input" type="text" placeholder="seu_nick ou voce@email.com" autoComplete="username" />
          </Field>
          <Field label="Senha" icon={Icons.lock(12)}>
            <input className="lh-input" type="password" placeholder="••••••••••" autoComplete="current-password" />
          </Field>
          <button className="btn-primary w-full justify-center mt-2" style={{ padding:'14px',fontSize:'14px' }}>
            {Icons.login(14)} {t.login}
          </button>
          <div className="text-center text-xs text-white/30 mt-1">
            <a className="hover:text-[#9b8fff] cursor-pointer transition-colors">Esqueci minha senha</a>
          </div>
          <div className="text-center text-xs text-white/30">
            Ainda não tem conta?{' '}
            <a className="text-[#9b8fff] cursor-pointer hover:underline" onClick={() => setTab('register')}>Criar conta</a>
          </div>
        </div>
      )}

      {/* REGISTER */}
      {tab==='register' && (
        <>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#615fff]" />
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#615fff]">1 · Dados</span>
              </div>
              <div className="space-y-3.5">
                <Field label="Nick (3–20 letras, números ou _)" icon={Icons.user(12)}>
                  <input className="lh-input" type="text" placeholder="seu_nick"
                    value={nick} onChange={e=>setNick(e.target.value)} autoComplete="username" />
                </Field>
                <Field label="E-mail (obrigatório)" icon={Icons.mail(12)}>
                  <input className="lh-input" type="email" placeholder="voce@email.com" autoComplete="email" />
                </Field>
                <Field label="Senha (8+ caracteres)" icon={Icons.lock(12)}>
                  <input className="lh-input" type="password" placeholder="••••••••" autoComplete="new-password" />
                </Field>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background:'rgba(255,255,255,0.15)' }} />
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-white/30">País / Chat Global</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-[196px] overflow-y-auto custom-scroll pr-1 mb-2.5">
                {COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => setCountry(c.code)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer border-none text-xs transition-all text-left"
                    style={{
                      background: country===c.code ? 'rgba(97,95,255,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${country===c.code ? '#615fff' : 'rgba(255,255,255,0.07)'}`,
                      color: country===c.code ? '#fff' : 'rgba(255,255,255,0.7)',
                    }}>
                    {/* Real flag image */}
                    <img src={FLAGS[c.flagKey]} alt={c.code}
                      style={{ width:24, height:17, borderRadius:4, objectFit:'cover', flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.4)' }} />
                    {c.name}
                  </button>
                ))}
              </div>
              {/* Char preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.08)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[#615fff]"
                  style={{ background:'linear-gradient(135deg,rgba(97,95,255,0.3),rgba(97,95,255,0.1))' }}>
                  {Icons.gamepad(22)}
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Seu personagem</div>
                  <div className={`text-sm ${nick ? 'text-white font-medium' : 'text-white/30 italic'}`}>
                    {nick || 'Seu nick'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary w-full justify-center mt-5" style={{ padding:'15px',fontSize:'14px' }}>
            Próximo: Criar Personagem {Icons.arrowRight(14)}
          </button>
          <div className="text-center text-xs text-white/30 mt-2">
            Já tem conta?{' '}
            <a className="text-[#9b8fff] cursor-pointer hover:underline" onClick={() => setTab('login')}>Entrar</a>
          </div>
        </>
      )}
    </Modal>
  )
}

function Field({ label, icon, children }: { label:string; icon:React.ReactNode; children:React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[2px] text-white/35 mb-1.5">
        {icon}{label}
      </div>
      {children}
    </div>
  )
}
