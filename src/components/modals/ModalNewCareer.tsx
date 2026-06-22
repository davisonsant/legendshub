import { useAppStore } from '@/store'
import Modal, { ModalClose } from '@/components/ui/Modal'

export default function ModalNewCareer() {
  const { closeModal, openModal } = useAppStore()

  return (
    <Modal maxWidth="700px">
      <ModalClose />

      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-2 h-2 rounded-full bg-[#615fff]" />
        <span className="text-[10px] font-bold uppercase tracking-[3px] text-white/30">Antes de começar</span>
      </div>

      <h2 className="font-display font-bold text-3xl text-white mb-3">
        Como você quer jogar LegendsHub?
      </h2>
      <p className="text-sm text-white/45 leading-relaxed mb-6 max-w-[520px]">
        Com uma conta, seus saves ficam sincronizados na nuvem, você participa do chat global por país, publica saves na comunidade e ganha badges. Sem conta, dá pra jogar tudo offline mesmo — só perde o lado social.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Entrar */}
        <CareerCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>}
          title="Entrar"
          desc="Já tenho uma conta LegendsHub."
          onClick={() => { closeModal(); openModal('auth-login') }}
        />
        {/* Criar Conta */}
        <CareerCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
          title="Criar Conta"
          desc="Saves na nuvem, chat global, comunidade e badges."
          onClick={() => { closeModal(); openModal('auth-signup') }}
        />
        {/* Jogar Offline */}
        <CareerCard
          recommended
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64A9 9 0 0 1 20.77 15"/><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/><path d="M12 2v4"/><path d="m2 2 20 20"/></svg>}
          title="Jogar Offline"
          desc="Continuo como visitante (só neste navegador)."
          onClick={closeModal}
        />
      </div>

      {/* Info box */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#a09dff]"
          style={{ background: 'rgba(97,95,255,0.2)', border: '1px solid rgba(97,95,255,0.3)' }}>O</span>
        <p className="text-[11px] text-white/35 leading-relaxed">
          Jogando offline, seus saves ficam apenas neste dispositivo e podem ser apagados se você limpar o cache do navegador. Você pode criar uma conta depois sem perder o progresso.
        </p>
      </div>
    </Modal>
  )
}

function CareerCard({ icon, title, desc, recommended, onClick }: {
  icon: React.ReactNode
  title: string
  desc: string
  recommended?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col p-5 rounded-xl cursor-pointer transition-all text-left border-none"
      style={{
        background: recommended
          ? 'linear-gradient(160deg, rgba(140,40,50,0.55) 0%, rgba(97,95,255,0.12) 100%)'
          : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${recommended ? '#615fff' : 'rgba(255,255,255,0.09)'}`,
      }}
    >
      {recommended && (
        <span className="absolute -top-px left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-b-md"
          style={{ background: '#c0383a', color: '#fff' }}>
          Recomendado
        </span>
      )}
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5"
        style={{
          background: recommended ? 'rgba(200,60,70,0.25)' : 'rgba(255,255,255,0.07)',
          border:     `1px solid ${recommended ? 'rgba(200,60,70,0.3)' : 'rgba(255,255,255,0.1)'}`,
          color:      recommended ? '#ff8080' : 'rgba(255,255,255,0.7)',
        }}>
        {icon}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[2.5px] text-white mb-1.5">{title}</div>
      <div className="text-xs text-white/45 leading-relaxed">{desc}</div>
    </button>
  )
}
