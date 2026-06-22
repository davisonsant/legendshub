import { useState } from 'react'
import { useAppStore } from '@/store'
import Modal, { ModalClose } from '@/components/ui/Modal'

export default function ModalLegalNotice() {
  const { agreeToTerms } = useAppStore()
  const [noShow, setNoShow] = useState(false)

  const handleAgree = () => {
    agreeToTerms()
  }

  return (
    <Modal maxWidth="580px">
      <ModalClose />
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,200,0,0.12)', border: '1px solid rgba(255,200,0,0.25)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
            <path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
        </div>
        <div>
          <div className="font-display font-bold text-lg uppercase tracking-[3px] text-white">Aviso Legal</div>
          <div className="text-[10px] uppercase tracking-[3px] text-white/35 mt-0.5">Leia antes de continuar</div>
        </div>
      </div>

      <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Body */}
      <div className="text-sm text-white/55 leading-relaxed max-h-60 overflow-y-auto custom-scroll pr-2 space-y-3">
        <p>O LegendsHub é um jogo de simulação fictício desenvolvido para fins de entretenimento e estudo, sem fins lucrativos. Não é afiliado, endossado ou conectado a quaisquer organizações, ligas, equipes, jogadores, torneios, marcas, imprensa, influencers ou entidades da indústria de eSports, incluindo a Riot Games ou o League of Legends.</p>
        <p>Todos os nomes, imagens, logotipos e propriedades intelectuais são de seus respectivos donos. A inclusão de tais elementos é puramente coincidente ou para fins de paródia e não implica qualquer propriedade, endosso ou autorização por parte do desenvolvedor.</p>

        <div className="flex gap-2.5 p-3 rounded-lg" style={{ background: 'rgba(97,95,255,0.12)', border: '1px solid rgba(97,95,255,0.25)', borderLeft: '3px solid #615fff' }}>
          <span>💡</span>
          <span className="text-sm font-semibold text-[#a09dff]">Este projeto é fan-made e independente. Nenhuma receita comercial é gerada a partir deste jogo.</span>
        </div>

        <p>O desenvolvedor não reivindica direitos sobre essas propriedades e se isenta de responsabilidade por imprecisões ou semelhanças percebidas.</p>
        <p>Acredita que seus direitos foram infringidos? Entre em contato com{' '}
          <a href="mailto:davison.sant@live.com" className="text-[#9b8fff] hover:underline">davison.sant@live.com</a>.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={noShow}
            onChange={e => setNoShow(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#615fff] cursor-pointer"
          />
          <span className="text-xs text-white/40">Não mostrar esta mensagem na próxima vez.</span>
        </label>
        <button className="btn-primary" onClick={handleAgree}>
          Li e Concordo →
        </button>
      </div>

      <div className="mt-2.5 text-[10px] text-white/20 text-center leading-relaxed">
        Ao concordar, você concorda que o jogo é fornecido "como está", sem garantias e o desenvolvedor não será responsabilizado por quaisquer reivindicações decorrentes de seu uso.
      </div>
    </Modal>
  )
}
