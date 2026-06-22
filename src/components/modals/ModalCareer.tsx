import { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import { ModalClose } from '@/components/ui/Modal'
import { getAllSaves, dbDelete, exportAllData } from '@/db'
import type { GameSave } from '@/types'
import { Icons } from '@/lib/icons'

export default function ModalCareer() {
  const { closeModal } = useAppStore()
  const [saves, setSaves] = useState<GameSave[]>([])
  const [loading, setLoading] = useState(true)
  const [totalKB, setTotalKB] = useState(0)

  const MAX_SLOTS = 6

  useEffect(() => {
    loadSaves()
  }, [])

  async function loadSaves() {
    setLoading(true)
    try {
      const all = await getAllSaves()
      setSaves(all.sort((a, b) => b.updatedAt - a.updatedAt))
      // estimate size
      const json = await exportAllData()
      setTotalKB(Math.round(json.length / 1024))
    } catch {
      setSaves([])
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar este save?')) return
    await dbDelete('saves', id)
    await loadSaves()
  }

  async function handleDeleteAll() {
    if (!confirm('Apagar TODOS os saves? Esta ação não pode ser desfeita.')) return
    for (const s of saves) await dbDelete('saves', s.id)
    await loadSaves()
  }

  async function handleExport() {
    const json = await exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `legendshub-save-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const inp = document.createElement('input')
    inp.type = 'file'
    inp.accept = '.json'
    inp.onchange = async () => {
      const file = inp.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const { importAllData } = await import('@/db')
        await importAllData(text)
        await loadSaves()
        alert('Save importado com sucesso!')
      } catch {
        alert('Erro ao importar o arquivo. Verifique se é um save válido do LegendsHub.')
      }
    }
    inp.click()
  }

  function formatDate(ts: number) {
    const d = new Date(ts)
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  function formatBudget(n: number) {
    return `R$ ${(n / 1_000_000).toFixed(1)}M`
  }

  // Fill empty slots
  const slots: (GameSave | null)[] = [...saves]
  while (slots.length < MAX_SLOTS) slots.push(null)

  return (
    <div className="fixed z-50 flex items-center justify-center"
      style={{ top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) closeModal() }}>

      <div className="relative rounded-2xl overflow-hidden"
        style={{
          width: 680, maxWidth: '96vw', maxHeight: '80vh',
          background: 'linear-gradient(160deg,#12151f 0%,#0d1020 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
        }}>
        <ModalClose />

        {/* Header */}
        <div className="flex-shrink-0 px-8 pt-7 pb-5 border-b border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-[3px] text-white/30 mb-1 flex items-center gap-2">
            <span className="font-bold">—</span> Menu
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display font-bold text-4xl text-white">Carregar save</h2>
              <p className="text-[11px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {saves.length}/{MAX_SLOTS} slots · {totalKB} KB
              </p>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-3.5 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            {/* Save current (disabled if no active career) */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
              title="Salva a carreira atual em um novo slot">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Salvar carreira atual
            </button>

            <button onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none"
              style={{ background: 'rgba(97,95,255,0.12)', border: '1px solid rgba(97,95,255,0.3)', color: '#a09dff' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Importar JSON
            </button>
          </div>

          {saves.length > 0 && (
            <button onClick={handleDeleteAll}
              className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer border-none bg-transparent"
              style={{ color: 'rgba(255,80,80,0.7)' }}
              onMouseEnter={e => (e.currentTarget.style.color='#ff5050')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(255,80,80,0.7)')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Apagar tudo
            </button>
          )}
        </div>

        {/* Slots area */}
        <div className="flex-1 overflow-y-auto px-8 py-5" style={{ scrollbarWidth: 'none' }}>
          {loading ? (
            <div className="flex items-center justify-center h-48 text-white/30 text-sm">Carregando...</div>
          ) : saves.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white/20"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-sm font-medium">Nenhum save manual ainda</p>
                <p className="text-white/25 text-xs mt-1">Use o botão acima para salvar a carreira atual ou importe um JSON.</p>
              </div>
            </div>
          ) : (
            /* Save slots */
            <div className="space-y-2.5">
              {slots.map((save, i) => (
                <SaveSlot key={i} slot={i + 1} save={save}
                  onLoad={() => { closeModal() }}
                  onExport={save ? handleExport : undefined}
                  onDelete={save ? () => handleDelete(save.id) : undefined}
                  formatDate={formatDate}
                  formatBudget={formatBudget} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Save Slot ─────────────────────────────────────────────────────── */
function SaveSlot({ slot, save, onLoad, onExport, onDelete, formatDate, formatBudget }: {
  slot: number
  save: GameSave | null
  onLoad: () => void
  onExport?: () => void
  onDelete?: () => void
  formatDate: (ts: number) => string
  formatBudget: (n: number) => string
}) {
  if (!save) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white/15"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {slot}
        </div>
        <span className="text-xs text-white/20 italic">Slot vazio</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all group cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(97,95,255,0.35)'; (e.currentTarget as HTMLElement).style.background='rgba(97,95,255,0.06)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)' }}>

      {/* Slot number */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: 'rgba(97,95,255,0.2)', color: '#9b8fff', border: '1px solid rgba(97,95,255,0.3)' }}>
        {slot}
      </div>

      {/* Team logo placeholder */}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{ background: 'rgba(97,95,255,0.15)', color: '#615fff', border: '1px solid rgba(97,95,255,0.2)' }}>
        {save.teamName?.[0] ?? '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate">{save.teamName}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ background: 'rgba(97,95,255,0.15)', color: '#9b8fff' }}>
            S{save.season} S{save.week}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-white/40">{formatDate(save.updatedAt)}</span>
          <span className="text-xs font-medium" style={{ color: '#615fff' }}>{formatBudget(save.budget)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={onLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all cursor-pointer border-none"
          style={{ background: '#615fff', color: '#fff', boxShadow: '0 4px 12px rgba(97,95,255,0.4)' }}>
          {Icons.play(11)} Jogar
        </button>
        {onExport && (
          <button onClick={onExport}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            title="Exportar save">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,80,80,0.5)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='#ff5050'; (e.currentTarget as HTMLElement).style.borderColor='rgba(255,80,80,0.3)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='rgba(255,80,80,0.5)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.1)' }}
            title="Deletar save">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        )}
      </div>
    </div>
  )
}
