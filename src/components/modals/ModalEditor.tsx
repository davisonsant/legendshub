import { useState } from 'react'
import { useAppStore } from '@/store'
import { ModalClose } from '@/components/ui/Modal'

// ── Sidebar nav items ──────────────────────────────────────────────
const NAV_ITEMS = [
  { section: 'main',    id: 'db',            label: 'Banco de Dados',  icon: '🗄' },
  { section: 'comp',    id: 'ligas',          label: 'Ligas',           icon: '🏆' },
  { section: 'comp',    id: 'times',          label: 'Times',           icon: '👥' },
  { section: 'comp',    id: 'jogadores',      label: 'Jogadores',       icon: '👤' },
  { section: 'comp',    id: 'managers',       label: 'Managers',        icon: '📋' },
  { section: 'eco',     id: 'imprensa',       label: 'Imprensa',        icon: '📰' },
  { section: 'eco',     id: 'influencers',    label: 'Influencers',     icon: '🌟' },
  { section: 'eco',     id: 'patrocinadores', label: 'Patrocinadores',  icon: '💰' },
  { section: 'game',    id: 'campeoes',       label: 'Campeões e Meta', icon: '⚔' },
]

const SECTION_LABELS: Record<string, string> = {
  main: 'Principal', comp: 'Competitivo', eco: 'Ecossistema', game: 'Gameplay'
}

export default function ModalEditor() {
  const { closeModal } = useAppStore()
  const [active, setActive] = useState('db')

  const sections = [...new Set(NAV_ITEMS.map(n => n.section))]

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          maxWidth: '1100px', width: '97%', maxHeight: '92vh',
          background: 'linear-gradient(160deg, #12151f 0%, #0d1020 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.07] flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#615fff" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          <span className="font-display font-bold text-xl tracking-widest text-white">LEGENDS<span style={{ color: '#615fff' }}>HUB</span></span>
          <span className="text-[10px] uppercase tracking-[3px] text-white/25 ml-1">Editor de Jogo</span>
          <ModalClose />
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Sidebar */}
          <div className="w-[185px] flex-shrink-0 flex flex-col gap-1 p-3 overflow-y-auto border-r border-white/[0.07]" style={{ background: 'rgba(0,0,0,0.2)' }}>
            {sections.map(sec => (
              <div key={sec}>
                <div className="text-[9px] font-bold uppercase tracking-[2.5px] text-white/20 px-2 py-2 mt-1">{SECTION_LABELS[sec]}</div>
                {NAV_ITEMS.filter(n => n.section === sec).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border-none text-left"
                    style={{
                      background: active === item.id ? 'rgba(97,95,255,0.18)' : 'transparent',
                      color:      active === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
                      border:     active === item.id ? '1px solid rgba(97,95,255,0.3)' : '1px solid transparent',
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-7 custom-scroll">
            {active === 'db'            && <PanelDB />}
            {active === 'ligas'         && <PanelLigas />}
            {active === 'times'         && <PanelTimes />}
            {active === 'jogadores'     && <PanelJogadores />}
            {active === 'managers'      && <PanelManagers />}
            {active === 'imprensa'      && <PanelImprensa />}
            {active === 'influencers'   && <PanelInfluencers />}
            {active === 'patrocinadores'&& <PanelPatrocinadores />}
            {active === 'campeoes'      && <PanelCampeoes />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shared helpers ─────────────────────────────────────────────────

function PanelHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display font-bold text-2xl text-white">{title}</h2>
      <p className="text-xs text-white/30 mt-0.5">{sub}</p>
    </div>
  )
}

function EdCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-[10px] font-bold uppercase tracking-[2.5px] mb-3" style={{ color: 'rgba(97,95,255,0.8)' }}>{title}</div>
      {children}
    </div>
  )
}

function TopBar({ search, onSearch, addLabel, children }: { search: string; onSearch: (v: string) => void; addLabel: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-2 flex-1 max-w-xs rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Buscar..." className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-white/25" />
      </div>
      {children}
      <button className="btn-primary text-[11px]" style={{ padding: '8px 16px' }}>+ {addLabel}</button>
    </div>
  )
}

function RatingBar({ val }: { val: number }) {
  const color = val >= 85 ? '#00c864' : val >= 70 ? '#9b8fff' : val >= 55 ? '#ffd700' : '#ff5050'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full" style={{ width: `${val}%`, background: color }} />
      </div>
      <span className="text-[10px] text-white/50 w-5 text-right">{val}</span>
    </div>
  )
}

function ActionBtns() {
  return (
    <div className="flex gap-1">
      {['✏','🖼','🗑'].map((icon, i) => (
        <button key={i} className="w-6 h-6 rounded flex items-center justify-center text-xs transition-all cursor-pointer border-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
          {icon}
        </button>
      ))}
    </div>
  )
}

// ── PANEL: DB ──────────────────────────────────────────────────────
function PanelDB() {
  const actions = [
    { icon: '⬆', label: 'Importar',  sub: 'Carregar .json / .lhdb' },
    { icon: '⬇', label: 'Exportar',  sub: 'Salvar backup' },
    { icon: '✏', label: 'Renomear',  sub: 'Alterar identificador' },
    { icon: '🗑', label: 'Deletar',   sub: 'Remover banco' },
    { icon: '🔧', label: 'Reparar',   sub: 'Corrigir inconsistências no IndexedDB', wide: true },
  ]
  return (
    <>
      <PanelHeader title="Banco de Dados" sub="Gerencie o ecossistema de dados padrão e customizados da comunidade." />
      <EdCard title="⚡ Ações Rápidas">
        <div className="grid grid-cols-4 gap-2.5">
          {actions.map(a => (
            <div key={a.label} className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all text-center ${a.wide ? 'col-span-2' : ''}`}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(97,95,255,0.15)', color: '#9b8fff' }}>{a.icon}</div>
              <div className="text-xs font-semibold text-white/90">{a.label}</div>
              <div className="text-[10px] text-white/30">{a.sub}</div>
            </div>
          ))}
        </div>
      </EdCard>
      <EdCard title="🗄 Bancos Instalados">
        {[
          { name: 'LegendsHub Base DB', meta: '6 ligas · 60 times · 290 jogadores · 172 campeões', badge: 'Padrão', color: '#615fff' },
          { name: 'Community Patch v2.3', meta: 'Ratings atualizados · Patch 14.10 · por siminino', badge: 'Comunidade', color: '#00c864' },
        ].map(db => (
          <div key={db.name} className="flex items-center gap-3 p-3 rounded-lg mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${db.color}22`, color: db.color }}>🗄</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">{db.name}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{db.meta}</div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded" style={{ background: `${db.color}22`, color: db.color, border: `1px solid ${db.color}44` }}>{db.badge}</span>
            <ActionBtns />
          </div>
        ))}
      </EdCard>
    </>
  )
}

// ── PANEL: LIGAS ──────────────────────────────────────────────────
const LIGAS_DATA = [
  { name: 'CBLOL', sigla: 'CBLOL', region: 'Brasil', times: 8 },
  { name: 'LCK',   sigla: 'LCK',   region: 'Coreia do Sul', times: 10 },
  { name: 'LEC',   sigla: 'LEC',   region: 'Europa', times: 10 },
  { name: 'LPL',   sigla: 'LPL',   region: 'China', times: 14 },
  { name: 'LCS',   sigla: 'LCS',   region: 'América do Norte', times: 8 },
  { name: 'LCP',   sigla: 'LCP',   region: 'Pacífico', times: 8 },
]
function PanelLigas() {
  const [search, setSearch] = useState('')
  const filtered = LIGAS_DATA.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <PanelHeader title="Ligas" sub="Gerencie as ligas regionais do circuito competitivo." />
      <TopBar search={search} onSearch={setSearch} addLabel="Nova Liga" />
      <table className="ed-table">
        <thead><tr><th>Liga</th><th>Sigla</th><th>Região</th><th>Times</th><th>Imagem</th><th>Ações</th></tr></thead>
        <tbody>
          {filtered.map(l => (
            <tr key={l.sigla}>
              <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#615fff]" style={{ background: 'rgba(97,95,255,0.2)' }}>{l.sigla[0]}</div>{l.name}</div></td>
              <td><span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>{l.sigla}</span></td>
              <td className="text-white/50">{l.region}</td>
              <td className="text-white/50">{l.times} times</td>
              <td><button className="w-6 h-6 rounded flex items-center justify-center text-xs border cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>🖼</button></td>
              <td><ActionBtns /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// ── PANEL: TIMES ──────────────────────────────────────────────────
const TIMES_DATA: Record<string, { name: string; sigla: string }[]> = {
  CBLOL: [
    { name:'LOUD', sigla:'LOU' }, { name:'paiN Gaming', sigla:'PNG' }, { name:'FURIA', sigla:'FUR' },
    { name:'RED Canids', sigla:'RED' }, { name:'Vivo Keyd', sigla:'VKS' }, { name:'Fluxo', sigla:'FLX' },
    { name:'LEVIATÁN', sigla:'LEV' }, { name:'LOS', sigla:'LOS' },
  ],
  LCK: [
    { name:'T1', sigla:'T1' }, { name:'Gen.G Esports', sigla:'GEN' }, { name:'Hanwha Life', sigla:'HLE' },
    { name:'KT Rolster', sigla:'KT' }, { name:'NS RedForce', sigla:'NS' }, { name:'Dplus KIA', sigla:'DK' },
    { name:'DN SOOPers', sigla:'DNS' }, { name:'DRX', sigla:'DRX' }, { name:'FEARX', sigla:'FRX' }, { name:'OKSavingsBank BRION', sigla:'BRO' },
  ],
  LEC: [
    { name:'G2 Esports', sigla:'G2' }, { name:'Fnatic', sigla:'FNC' }, { name:'Movistar KOI', sigla:'KOI' },
    { name:'Karmine Corp', sigla:'KC' }, { name:'SK Gaming', sigla:'SK' }, { name:'GIANTX', sigla:'GX' },
    { name:'Team Vitality', sigla:'VIT' }, { name:'Shifters', sigla:'SHF' }, { name:'Team Heretics', sigla:'TH' }, { name:'Natus Vincere', sigla:'NAVI' },
  ],
  LPL: [
    { name:'Bilibili Gaming', sigla:'BLG' }, { name:"Anyone's Legend", sigla:'AL' }, { name:'JD Gaming', sigla:'JDG' },
    { name:'Top Esports', sigla:'TES' }, { name:'Weibo Gaming', sigla:'WBG' }, { name:'EDward Gaming', sigla:'EDG' },
    { name:'Invictus Gaming', sigla:'IG' }, { name:'LGD Gaming', sigla:'LGD' }, { name:'LNG Esports', sigla:'LNG' },
    { name:'Oh My God', sigla:'OMG' }, { name:'Ultra Prime', sigla:'UP' }, { name:'ThunderTalk', sigla:'TT' },
    { name:'Ninjas in Pyjamas', sigla:'NIP' }, { name:'Team WE', sigla:'WE' },
  ],
  LCS: [
    { name:'LYON', sigla:'LYN' }, { name:'Cloud9', sigla:'C9' }, { name:'Team Liquid', sigla:'TL' },
    { name:'FlyQuest', sigla:'FLY' }, { name:'Dignitas', sigla:'DIG' }, { name:'Sentinels', sigla:'SEN' },
    { name:'Shopify Rebellion', sigla:'SHO' }, { name:'Disguised', sigla:'DSG' },
  ],
  LCP: [
    { name:'CTBC Flying Oyster', sigla:'CFO' }, { name:'GAM Esports', sigla:'GAM' }, { name:'Fukuoka SoftBank', sigla:'FSB' },
    { name:'Secret Whales', sigla:'SW' }, { name:'DetonatioN FM', sigla:'DFM' }, { name:'MVK Esports', sigla:'MVK' },
    { name:'Deep Cross Gaming', sigla:'DCG' }, { name:'Ground Zero Gaming', sigla:'GZG' },
  ],
}

function PanelTimes() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('CBLOL')
  const leagues = Object.keys(TIMES_DATA)
  const teams = (TIMES_DATA[region] ?? []).filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
  const rng = (seed: number, min: number, max: number) => min + ((seed * 137 + 42) % (max - min))

  return (
    <>
      <PanelHeader title="Times" sub="Gerencie os times do competitivo separados por região." />
      <TopBar search={search} onSearch={setSearch} addLabel="Novo Time" />
      <div className="flex gap-1.5 flex-wrap mb-4">
        {leagues.map(l => (
          <button key={l} onClick={() => setRegion(l)} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide cursor-pointer border-none transition-all"
            style={{ background: region === l ? 'rgba(97,95,255,0.18)' : 'rgba(255,255,255,0.04)', color: region === l ? '#fff' : 'rgba(255,255,255,0.4)', border: `1px solid ${region === l ? '#615fff' : 'rgba(255,255,255,0.1)'}` }}>
            {l}
          </button>
        ))}
      </div>
      <table className="ed-table">
        <thead><tr><th>Time</th><th>Sigla</th><th>Liga</th><th>Orçamento</th><th>Popularidade</th><th>Ações</th></tr></thead>
        <tbody>
          {teams.map((t, i) => {
            const seed = t.name.charCodeAt(0) + t.name.length + i
            const pop = 50 + (seed * 73 % 46)
            const budget = ((seed * 137 + 42) % 420) / 10 + 8
            return (
              <tr key={t.name}>
                <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(155,140,255,0.2)', color: '#9b8fff' }}>{t.name[0]}</div>{t.name}</div></td>
                <td className="text-white/50 font-mono text-[10px]">{t.sigla}</td>
                <td><span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>{region}</span></td>
                <td className="text-white/60">R$ {budget.toFixed(1)}M</td>
                <td style={{ width: 140 }}><RatingBar val={pop} /></td>
                <td><ActionBtns /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

const PLAYERS_PRINCIPAL_FULL = [
  {nick:'Doran',liga:'LCK',team:'T1',pos:'Top',overall:67,potential:67,rep:70},
  {nick:'Oner',liga:'LCK',team:'T1',pos:'Jungle',overall:86,potential:90,rep:73},
  {nick:'Faker',liga:'LCK',team:'T1',pos:'Mid',overall:90,potential:93,rep:74},
  {nick:'Peyz',liga:'LCK',team:'T1',pos:'ADC',overall:84,potential:85,rep:85},
  {nick:'Keria',liga:'LCK',team:'T1',pos:'Support',overall:89,potential:97,rep:71},
  {nick:'Kiin',liga:'LCK',team:'Gen.G Esports',pos:'Top',overall:84,potential:90,rep:65},
  {nick:'Canyon',liga:'LCK',team:'Gen.G Esports',pos:'Jungle',overall:88,potential:88,rep:70},
  {nick:'Chovy',liga:'LCK',team:'Gen.G Esports',pos:'Mid',overall:89,potential:92,rep:76},
  {nick:'Ruler',liga:'LCK',team:'Gen.G Esports',pos:'ADC',overall:88,potential:96,rep:87},
  {nick:'Duro',liga:'LCK',team:'Gen.G Esports',pos:'Support',overall:82,potential:82,rep:79},
  {nick:'Zeus',liga:'LCK',team:'Hanwha Life',pos:'Top',overall:87,potential:90,rep:89},
  {nick:'Kanavi',liga:'LCK',team:'Hanwha Life',pos:'Jungle',overall:77,potential:80,rep:71},
  {nick:'Zeka',liga:'LCK',team:'Hanwha Life',pos:'Mid',overall:72,potential:72,rep:76},
  {nick:'Gumayusi',liga:'LCK',team:'Hanwha Life',pos:'ADC',overall:85,potential:87,rep:87},
  {nick:'Delight',liga:'LCK',team:'Hanwha Life',pos:'Support',overall:77,potential:82,rep:65},
  {nick:'PerfecT',liga:'LCK',team:'KT Rolster',pos:'Top',overall:68,potential:71,rep:78},
  {nick:'Cuzz',liga:'LCK',team:'KT Rolster',pos:'Jungle',overall:74,potential:75,rep:56},
  {nick:'Bdd',liga:'LCK',team:'KT Rolster',pos:'Mid',overall:76,potential:77,rep:67},
  {nick:'Aiming',liga:'LCK',team:'KT Rolster',pos:'ADC',overall:75,potential:79,rep:80},
  {nick:'Effort',liga:'LCK',team:'KT Rolster',pos:'Support',overall:65,potential:72,rep:62},
  {nick:'Kingen',liga:'LCK',team:'NS RedForce',pos:'Top',overall:67,potential:73,rep:49},
  {nick:'Sponge',liga:'LCK',team:'NS RedForce',pos:'Jungle',overall:73,potential:78,rep:71},
  {nick:'Scout',liga:'LCK',team:'NS RedForce',pos:'Mid',overall:70,potential:71,rep:51},
  {nick:'Taeyoon',liga:'LCK',team:'NS RedForce',pos:'ADC',overall:71,potential:75,rep:53},
  {nick:'Lehends',liga:'LCK',team:'NS RedForce',pos:'Support',overall:71,potential:72,rep:63},
  {nick:'Siwoo',liga:'LCK',team:'Dplus KIA',pos:'Top',overall:72,potential:79,rep:72},
  {nick:'Lucid',liga:'LCK',team:'Dplus KIA',pos:'Jungle',overall:75,potential:77,rep:66},
  {nick:'ShowMaker',liga:'LCK',team:'Dplus KIA',pos:'Mid',overall:87,potential:92,rep:73},
  {nick:'Smash',liga:'LCK',team:'Dplus KIA',pos:'ADC',overall:72,potential:73,rep:71},
  {nick:'Career',liga:'LCK',team:'Dplus KIA',pos:'Support',overall:69,potential:77,rep:72},
  {nick:'DuDu',liga:'LCK',team:'DN SOOPers',pos:'Top',overall:71,potential:73,rep:65},
  {nick:'Pyosik',liga:'LCK',team:'DN SOOPers',pos:'Jungle',overall:76,potential:80,rep:85},
  {nick:'Clozer',liga:'LCK',team:'DN SOOPers',pos:'Mid',overall:71,potential:76,rep:77},
  {nick:'deokdam',liga:'LCK',team:'DN SOOPers',pos:'ADC',overall:65,potential:68,rep:71},
  {nick:'Peter',liga:'LCK',team:'DN SOOPers',pos:'Support',overall:65,potential:70,rep:57},
  {nick:'Rich',liga:'LCK',team:'DRX',pos:'Top',overall:72,potential:73,rep:58},
  {nick:'Vincenzo',liga:'LCK',team:'DRX',pos:'Jungle',overall:74,potential:77,rep:74},
  {nick:'ucal',liga:'LCK',team:'DRX',pos:'Mid',overall:79,potential:85,rep:87},
  {nick:'Jiwoo',liga:'LCK',team:'DRX',pos:'ADC',overall:78,potential:80,rep:66},
  {nick:'Andil',liga:'LCK',team:'DRX',pos:'Support',overall:68,potential:71,rep:71},
  {nick:'Clear',liga:'LCK',team:'FEARX',pos:'Top',overall:72,potential:78,rep:80},
  {nick:'Raptor',liga:'LCK',team:'FEARX',pos:'Jungle',overall:76,potential:81,rep:63},
  {nick:'VicLa',liga:'LCK',team:'FEARX',pos:'Mid',overall:68,potential:76,rep:63},
  {nick:'Diable',liga:'LCK',team:'FEARX',pos:'ADC',overall:66,potential:66,rep:73},
  {nick:'Kellin',liga:'LCK',team:'FEARX',pos:'Support',overall:67,potential:69,rep:67},
  {nick:'Casting',liga:'LCK',team:'OKSavingsBank BRION',pos:'Top',overall:69,potential:75,rep:68},
  {nick:'GIDEON',liga:'LCK',team:'OKSavingsBank BRION',pos:'Jungle',overall:66,potential:72,rep:58},
  {nick:'Fisher',liga:'LCK',team:'OKSavingsBank BRION',pos:'Mid',overall:78,potential:86,rep:66},
  {nick:'Teddy',liga:'LCK',team:'OKSavingsBank BRION',pos:'ADC',overall:64,potential:65,rep:65},
  {nick:'Namgung',liga:'LCK',team:'OKSavingsBank BRION',pos:'Support',overall:72,potential:77,rep:55},
  {nick:'Bin',liga:'LPL',team:'Bilibili Gaming',pos:'Top',overall:88,potential:92,rep:81},
  {nick:'Xun',liga:'LPL',team:'Bilibili Gaming',pos:'Jungle',overall:70,potential:77,rep:50},
  {nick:'Knight',liga:'LPL',team:'Bilibili Gaming',pos:'Mid',overall:91,potential:95,rep:87},
  {nick:'Viper',liga:'LPL',team:'Bilibili Gaming',pos:'ADC',overall:88,potential:90,rep:84},
  {nick:'ON',liga:'LPL',team:'Bilibili Gaming',pos:'Support',overall:68,potential:72,rep:74},
  {nick:'Flandre',liga:'LPL',team:"Anyone's Legend",pos:'Top',overall:82,potential:90,rep:81},
  {nick:'Tarzan',liga:'LPL',team:"Anyone's Legend",pos:'Jungle',overall:85,potential:88,rep:69},
  {nick:'Shanks',liga:'LPL',team:"Anyone's Legend",pos:'Mid',overall:76,potential:78,rep:73},
  {nick:'Hope',liga:'LPL',team:"Anyone's Legend",pos:'ADC',overall:81,potential:81,rep:80},
  {nick:'Kael',liga:'LPL',team:"Anyone's Legend",pos:'Support',overall:75,potential:82,rep:55},
  {nick:'Xiaoxu',liga:'LPL',team:'JD Gaming',pos:'Top',overall:68,potential:73,rep:76},
  {nick:'JunJia',liga:'LPL',team:'JD Gaming',pos:'Jungle',overall:74,potential:77,rep:55},
  {nick:'HongQ',liga:'LPL',team:'JD Gaming',pos:'Mid',overall:72,potential:73,rep:54},
  {nick:'GALA',liga:'LPL',team:'JD Gaming',pos:'ADC',overall:87,potential:94,rep:93},
  {nick:'Vampire',liga:'LPL',team:'JD Gaming',pos:'Support',overall:67,potential:75,rep:71},
  {nick:'369',liga:'LPL',team:'Top Esports',pos:'Top',overall:69,potential:71,rep:70},
  {nick:'naiyou',liga:'LPL',team:'Top Esports',pos:'Jungle',overall:80,potential:88,rep:65},
  {nick:'Creme',liga:'LPL',team:'Top Esports',pos:'Mid',overall:73,potential:81,rep:80},
  {nick:'JackeyLove',liga:'LPL',team:'Top Esports',pos:'ADC',overall:87,potential:93,rep:97},
  {nick:'fengyue',liga:'LPL',team:'Top Esports',pos:'Support',overall:71,potential:79,rep:75},
  {nick:'Zika',liga:'LPL',team:'Weibo Gaming',pos:'Top',overall:81,potential:84,rep:83},
  {nick:'Jiejie',liga:'LPL',team:'Weibo Gaming',pos:'Jungle',overall:74,potential:80,rep:75},
  {nick:'Xiaohu',liga:'LPL',team:'Weibo Gaming',pos:'Mid',overall:76,potential:83,rep:84},
  {nick:'Elk',liga:'LPL',team:'Weibo Gaming',pos:'ADC',overall:86,potential:94,rep:80},
  {nick:'Erha',liga:'LPL',team:'Weibo Gaming',pos:'Support',overall:68,potential:71,rep:55},
  {nick:'Zdz',liga:'LPL',team:'EDward Gaming',pos:'Top',overall:67,potential:72,rep:47},
  {nick:'Xiaohao',liga:'LPL',team:'EDward Gaming',pos:'Jungle',overall:72,potential:75,rep:52},
  {nick:'Angel',liga:'LPL',team:'EDward Gaming',pos:'Mid',overall:67,potential:67,rep:54},
  {nick:'Leave',liga:'LPL',team:'EDward Gaming',pos:'ADC',overall:67,potential:67,rep:74},
  {nick:'Parukia',liga:'LPL',team:'EDward Gaming',pos:'Support',overall:75,potential:76,rep:71},
  {nick:'Soboro',liga:'LPL',team:'Invictus Gaming',pos:'Top',overall:72,potential:76,rep:73},
  {nick:'Wei',liga:'LPL',team:'Invictus Gaming',pos:'Jungle',overall:80,potential:83,rep:77},
  {nick:'Rookie',liga:'LPL',team:'Invictus Gaming',pos:'Mid',overall:86,potential:88,rep:89},
  {nick:'Photic',liga:'LPL',team:'Invictus Gaming',pos:'ADC',overall:80,potential:83,rep:85},
  {nick:'Meiko',liga:'LPL',team:'Invictus Gaming',pos:'Support',overall:80,potential:86,rep:66},
  {nick:'sasi',liga:'LPL',team:'LGD Gaming',pos:'Top',overall:68,potential:69,rep:69},
  {nick:'Heng',liga:'LPL',team:'LGD Gaming',pos:'Jungle',overall:78,potential:83,rep:71},
  {nick:'Tangyuan',liga:'LPL',team:'LGD Gaming',pos:'Mid',overall:78,potential:85,rep:85},
  {nick:'Shaoye',liga:'LPL',team:'LGD Gaming',pos:'ADC',overall:66,potential:67,rep:47},
  {nick:'Ycx',liga:'LPL',team:'LGD Gaming',pos:'Support',overall:77,potential:82,rep:82},
  {nick:'Croco',liga:'LPL',team:'LNG Esports',pos:'Jungle',overall:68,potential:71,rep:54},
  {nick:'BuLLDoG',liga:'LPL',team:'LNG Esports',pos:'ADC',overall:80,potential:83,rep:77},
  {nick:'LNG_Top',liga:'LPL',team:'LNG Esports',pos:'Top',overall:79,potential:81,rep:72},
  {nick:'LNG_Mid',liga:'LPL',team:'LNG Esports',pos:'Mid',overall:70,potential:74,rep:64},
  {nick:'LNG_Sup',liga:'LPL',team:'LNG Esports',pos:'Support',overall:72,potential:73,rep:66},
  {nick:'Juhan',liga:'LPL',team:'Oh My God',pos:'Jungle',overall:68,potential:68,rep:68},
  {nick:'OMG_Top',liga:'LPL',team:'Oh My God',pos:'Top',overall:65,potential:66,rep:74},
  {nick:'OMG_Mid',liga:'LPL',team:'Oh My God',pos:'Mid',overall:72,potential:74,rep:65},
  {nick:'OMG_Bot',liga:'LPL',team:'Oh My God',pos:'ADC',overall:80,potential:87,rep:66},
  {nick:'OMG_Sup',liga:'LPL',team:'Oh My God',pos:'Support',overall:77,potential:77,rep:62},
  {nick:'Hena',liga:'LPL',team:'Ultra Prime',pos:'ADC',overall:77,potential:77,rep:69},
  {nick:'Grizzly',liga:'LPL',team:'Ultra Prime',pos:'Support',overall:73,potential:80,rep:62},
  {nick:'UP_Top',liga:'LPL',team:'Ultra Prime',pos:'Top',overall:78,potential:86,rep:79},
  {nick:'UP_Jun',liga:'LPL',team:'Ultra Prime',pos:'Jungle',overall:80,potential:82,rep:66},
  {nick:'UP_Mid',liga:'LPL',team:'Ultra Prime',pos:'Mid',overall:74,potential:77,rep:84},
  {nick:'TT_Top',liga:'LPL',team:'ThunderTalk',pos:'Top',overall:66,potential:74,rep:47},
  {nick:'TT_Jun',liga:'LPL',team:'ThunderTalk',pos:'Jungle',overall:75,potential:75,rep:56},
  {nick:'TT_Mid',liga:'LPL',team:'ThunderTalk',pos:'Mid',overall:80,potential:88,rep:89},
  {nick:'TT_Bot',liga:'LPL',team:'ThunderTalk',pos:'ADC',overall:81,potential:83,rep:62},
  {nick:'TT_Sup',liga:'LPL',team:'ThunderTalk',pos:'Support',overall:81,potential:82,rep:88},
  {nick:'NIP_Top',liga:'LPL',team:'Ninjas in Pyjamas',pos:'Top',overall:70,potential:71,rep:69},
  {nick:'NIP_Jun',liga:'LPL',team:'Ninjas in Pyjamas',pos:'Jungle',overall:67,potential:70,rep:59},
  {nick:'NIP_Mid',liga:'LPL',team:'Ninjas in Pyjamas',pos:'Mid',overall:68,potential:71,rep:66},
  {nick:'NIP_Bot',liga:'LPL',team:'Ninjas in Pyjamas',pos:'ADC',overall:66,potential:67,rep:59},
  {nick:'NIP_Sup',liga:'LPL',team:'Ninjas in Pyjamas',pos:'Support',overall:81,potential:86,rep:90},
  {nick:'WE_Top',liga:'LPL',team:'Team WE',pos:'Top',overall:73,potential:76,rep:74},
  {nick:'WE_Jun',liga:'LPL',team:'Team WE',pos:'Jungle',overall:75,potential:78,rep:63},
  {nick:'WE_Mid',liga:'LPL',team:'Team WE',pos:'Mid',overall:77,potential:79,rep:78},
  {nick:'WE_Bot',liga:'LPL',team:'Team WE',pos:'ADC',overall:74,potential:81,rep:64},
  {nick:'WE_Sup',liga:'LPL',team:'Team WE',pos:'Support',overall:67,potential:67,rep:61},
  {nick:'BrokenBlade',liga:'LEC',team:'G2 Esports',pos:'Top',overall:85,potential:86,rep:67},
  {nick:'SkewMond',liga:'LEC',team:'G2 Esports',pos:'Jungle',overall:68,potential:76,rep:56},
  {nick:'Caps',liga:'LEC',team:'G2 Esports',pos:'Mid',overall:87,potential:89,rep:96},
  {nick:'Hans Sama',liga:'LEC',team:'G2 Esports',pos:'ADC',overall:86,potential:91,rep:94},
  {nick:'Labrov',liga:'LEC',team:'G2 Esports',pos:'Support',overall:64,potential:67,rep:55},
  {nick:'Empyros',liga:'LEC',team:'Fnatic',pos:'Top',overall:71,potential:73,rep:65},
  {nick:'Razork',liga:'LEC',team:'Fnatic',pos:'Jungle',overall:71,potential:79,rep:51},
  {nick:'Vladi',liga:'LEC',team:'Fnatic',pos:'Mid',overall:71,potential:72,rep:81},
  {nick:'Upset',liga:'LEC',team:'Fnatic',pos:'ADC',overall:84,potential:86,rep:72},
  {nick:'Lospa',liga:'LEC',team:'Fnatic',pos:'Support',overall:65,potential:66,rep:68},
  {nick:'Myrwn',liga:'LEC',team:'Movistar KOI',pos:'Top',overall:66,potential:70,rep:55},
  {nick:'Elyoya',liga:'LEC',team:'Movistar KOI',pos:'Jungle',overall:82,potential:85,rep:84},
  {nick:'Jojopyun',liga:'LEC',team:'Movistar KOI',pos:'Mid',overall:72,potential:75,rep:73},
  {nick:'Supa',liga:'LEC',team:'Movistar KOI',pos:'ADC',overall:70,potential:78,rep:65},
  {nick:'Alvaro',liga:'LEC',team:'Movistar KOI',pos:'Support',overall:70,potential:70,rep:52},
  {nick:'Canna',liga:'LEC',team:'Karmine Corp',pos:'Top',overall:75,potential:79,rep:56},
  {nick:'Yike',liga:'LEC',team:'Karmine Corp',pos:'Jungle',overall:62,potential:67,rep:66},
  {nick:'Kyeahoo',liga:'LEC',team:'Karmine Corp',pos:'Mid',overall:66,potential:70,rep:51},
  {nick:'Caliste',liga:'LEC',team:'Karmine Corp',pos:'ADC',overall:76,potential:84,rep:78},
  {nick:'Busio',liga:'LEC',team:'Karmine Corp',pos:'Support',overall:75,potential:83,rep:55},
  {nick:'Wunder',liga:'LEC',team:'SK Gaming',pos:'Top',overall:82,potential:83,rep:64},
  {nick:'Skeanz',liga:'LEC',team:'SK Gaming',pos:'Jungle',overall:66,potential:74,rep:47},
  {nick:'LIDER',liga:'LEC',team:'SK Gaming',pos:'Mid',overall:73,potential:81,rep:57},
  {nick:'Jopa',liga:'LEC',team:'SK Gaming',pos:'ADC',overall:75,potential:77,rep:56},
  {nick:'Mikyx',liga:'LEC',team:'SK Gaming',pos:'Support',overall:71,potential:76,rep:79},
  {nick:'Lot',liga:'LEC',team:'GIANTX',pos:'Top',overall:63,potential:68,rep:49},
  {nick:'ISMA',liga:'LEC',team:'GIANTX',pos:'Jungle',overall:69,potential:70,rep:60},
  {nick:'Jackies',liga:'LEC',team:'GIANTX',pos:'Mid',overall:75,potential:77,rep:84},
  {nick:'Noah',liga:'LEC',team:'GIANTX',pos:'ADC',overall:69,potential:71,rep:74},
  {nick:'Jun',liga:'LEC',team:'GIANTX',pos:'Support',overall:67,potential:73,rep:47},
  {nick:'Naak Nako',liga:'LEC',team:'Team Vitality',pos:'Top',overall:67,potential:72,rep:72},
  {nick:'Lyncas',liga:'LEC',team:'Team Vitality',pos:'Jungle',overall:75,potential:78,rep:63},
  {nick:'Humanoid',liga:'LEC',team:'Team Vitality',pos:'Mid',overall:83,potential:85,rep:88},
  {nick:'Carzzy',liga:'LEC',team:'Team Vitality',pos:'ADC',overall:65,potential:71,rep:72},
  {nick:'Fleshy',liga:'LEC',team:'Team Vitality',pos:'Support',overall:63,potential:70,rep:50},
  {nick:'Rooster',liga:'LEC',team:'Shifters',pos:'Top',overall:68,potential:75,rep:59},
  {nick:'Boukada',liga:'LEC',team:'Shifters',pos:'Jungle',overall:71,potential:74,rep:58},
  {nick:'nuc',liga:'LEC',team:'Shifters',pos:'Mid',overall:62,potential:65,rep:54},
  {nick:'Paduck',liga:'LEC',team:'Shifters',pos:'ADC',overall:72,potential:76,rep:79},
  {nick:'Trymbi',liga:'LEC',team:'Shifters',pos:'Support',overall:64,potential:68,rep:55},
  {nick:'Tracyn',liga:'LEC',team:'Team Heretics',pos:'Top',overall:78,potential:84,rep:79},
  {nick:'Sheo',liga:'LEC',team:'Team Heretics',pos:'Jungle',overall:72,potential:72,rep:55},
  {nick:'Serin',liga:'LEC',team:'Team Heretics',pos:'Mid',overall:70,potential:72,rep:68},
  {nick:'Ice',liga:'LEC',team:'Team Heretics',pos:'ADC',overall:70,potential:70,rep:53},
  {nick:'Stend',liga:'LEC',team:'Team Heretics',pos:'Support',overall:75,potential:80,rep:78},
  {nick:'Maynter',liga:'LEC',team:'Natus Vincere',pos:'Top',overall:72,potential:78,rep:71},
  {nick:'Rhilech',liga:'LEC',team:'Natus Vincere',pos:'Jungle',overall:78,potential:79,rep:70},
  {nick:'Poby',liga:'LEC',team:'Natus Vincere',pos:'Mid',overall:68,potential:72,rep:49},
  {nick:'SamD',liga:'LEC',team:'Natus Vincere',pos:'ADC',overall:75,potential:75,rep:71},
  {nick:'Parus',liga:'LEC',team:'Natus Vincere',pos:'Support',overall:68,potential:73,rep:61},
  {nick:'Zamudo',liga:'LCS',team:'LYON',pos:'Top',overall:62,potential:67,rep:61},
  {nick:'Inspired',liga:'LCS',team:'LYON',pos:'Jungle',overall:83,potential:88,rep:84},
  {nick:'Saint',liga:'LCS',team:'LYON',pos:'Mid',overall:63,potential:67,rep:59},
  {nick:'Berserker',liga:'LCS',team:'LYON',pos:'ADC',overall:86,potential:90,rep:87},
  {nick:'Isles',liga:'LCS',team:'LYON',pos:'Support',overall:73,potential:78,rep:65},
  {nick:'Thanatos',liga:'LCS',team:'Cloud9',pos:'Top',overall:69,potential:77,rep:53},
  {nick:'Blaber',liga:'LCS',team:'Cloud9',pos:'Jungle',overall:82,potential:85,rep:75},
  {nick:'APA',liga:'LCS',team:'Cloud9',pos:'Mid',overall:72,potential:74,rep:71},
  {nick:'Zven',liga:'LCS',team:'Cloud9',pos:'ADC',overall:69,potential:75,rep:66},
  {nick:'Vulcan',liga:'LCS',team:'Cloud9',pos:'Support',overall:60,potential:64,rep:49},
  {nick:'Morgan',liga:'LCS',team:'Team Liquid',pos:'Top',overall:66,potential:72,rep:71},
  {nick:'Josedeodo',liga:'LCS',team:'Team Liquid',pos:'Jungle',overall:70,potential:77,rep:64},
  {nick:'Quid',liga:'LCS',team:'Team Liquid',pos:'Mid',overall:74,potential:77,rep:70},
  {nick:'Yeon',liga:'LCS',team:'Team Liquid',pos:'ADC',overall:75,potential:77,rep:76},
  {nick:'CoreJJ',liga:'LCS',team:'Team Liquid',pos:'Support',overall:84,potential:85,rep:73},
  {nick:'Gakgos',liga:'LCS',team:'FlyQuest',pos:'Top',overall:76,potential:81,rep:58},
  {nick:'Gryffinn',liga:'LCS',team:'FlyQuest',pos:'Jungle',overall:67,potential:71,rep:54},
  {nick:'Quad',liga:'LCS',team:'FlyQuest',pos:'Mid',overall:66,potential:68,rep:46},
  {nick:'Massu',liga:'LCS',team:'FlyQuest',pos:'ADC',overall:61,potential:64,rep:56},
  {nick:'Cryogen',liga:'LCS',team:'FlyQuest',pos:'Support',overall:62,potential:69,rep:55},
  {nick:'Photon',liga:'LCS',team:'Dignitas',pos:'Top',overall:66,potential:72,rep:61},
  {nick:'eXyu',liga:'LCS',team:'Dignitas',pos:'Jungle',overall:72,potential:75,rep:56},
  {nick:'Palafox',liga:'LCS',team:'Dignitas',pos:'Mid',overall:60,potential:61,rep:64},
  {nick:'FBI',liga:'LCS',team:'Dignitas',pos:'ADC',overall:73,potential:76,rep:58},
  {nick:'IgNar',liga:'LCS',team:'Dignitas',pos:'Support',overall:76,potential:83,rep:57},
  {nick:'Impact',liga:'LCS',team:'Sentinels',pos:'Top',overall:67,potential:68,rep:61},
  {nick:'HamBak',liga:'LCS',team:'Sentinels',pos:'Jungle',overall:64,potential:71,rep:65},
  {nick:'DARKWINGS',liga:'LCS',team:'Sentinels',pos:'Mid',overall:76,potential:84,rep:75},
  {nick:'Rahel',liga:'LCS',team:'Sentinels',pos:'ADC',overall:70,potential:77,rep:69},
  {nick:'huhi',liga:'LCS',team:'Sentinels',pos:'Support',overall:76,potential:82,rep:82},
  {nick:'SHO_Top',liga:'LCS',team:'Shopify Rebellion',pos:'Top',overall:74,potential:76,rep:77},
  {nick:'SHO_Jun',liga:'LCS',team:'Shopify Rebellion',pos:'Jungle',overall:75,potential:82,rep:63},
  {nick:'Zinie',liga:'LCS',team:'Shopify Rebellion',pos:'Mid',overall:67,potential:71,rep:71},
  {nick:'SHO_Bot',liga:'LCS',team:'Shopify Rebellion',pos:'ADC',overall:76,potential:83,rep:76},
  {nick:'SHO_Sup',liga:'LCS',team:'Shopify Rebellion',pos:'Support',overall:67,potential:71,rep:61},
  {nick:'DIS_Top',liga:'LCS',team:'Disguised',pos:'Top',overall:62,potential:66,rep:49},
  {nick:'DIS_Jun',liga:'LCS',team:'Disguised',pos:'Jungle',overall:68,potential:73,rep:58},
  {nick:'DIS_Mid',liga:'LCS',team:'Disguised',pos:'Mid',overall:62,potential:64,rep:46},
  {nick:'DIS_Bot',liga:'LCS',team:'Disguised',pos:'ADC',overall:67,potential:73,rep:69},
  {nick:'DIS_Sup',liga:'LCS',team:'Disguised',pos:'Support',overall:64,potential:67,rep:46},
  {nick:'xyno',liga:'CBLOL',team:'LOUD',pos:'Top',overall:76,potential:82,rep:69},
  {nick:'Youngjae',liga:'CBLOL',team:'LOUD',pos:'Jungle',overall:67,potential:75,rep:61},
  {nick:'Jean Mago',liga:'CBLOL',team:'LOUD',pos:'Mid',overall:78,potential:84,rep:59},
  {nick:'Bull',liga:'CBLOL',team:'LOUD',pos:'ADC',overall:63,potential:69,rep:55},
  {nick:'Redbert',liga:'CBLOL',team:'LOUD',pos:'Support',overall:57,potential:63,rep:52},
  {nick:'Robo',liga:'CBLOL',team:'paiN Gaming',pos:'Top',overall:57,potential:62,rep:46},
  {nick:'Cariok',liga:'CBLOL',team:'paiN Gaming',pos:'Jungle',overall:69,potential:75,rep:66},
  {nick:'tinowns',liga:'CBLOL',team:'paiN Gaming',pos:'Mid',overall:80,potential:88,rep:85},
  {nick:'TitaN',liga:'CBLOL',team:'paiN Gaming',pos:'ADC',overall:64,potential:71,rep:51},
  {nick:'Kuri',liga:'CBLOL',team:'paiN Gaming',pos:'Support',overall:65,potential:71,rep:60},
  {nick:'Guigo',liga:'CBLOL',team:'FURIA',pos:'Top',overall:77,potential:77,rep:69},
  {nick:'Tatu',liga:'CBLOL',team:'FURIA',pos:'Jungle',overall:67,potential:73,rep:70},
  {nick:'Tutsz',liga:'CBLOL',team:'FURIA',pos:'Mid',overall:62,potential:69,rep:71},
  {nick:'Ayu',liga:'CBLOL',team:'FURIA',pos:'ADC',overall:61,potential:69,rep:41},
  {nick:'Jojo',liga:'CBLOL',team:'FURIA',pos:'Support',overall:69,potential:69,rep:51},
  {nick:'fNb',liga:'CBLOL',team:'RED Canids',pos:'Top',overall:70,potential:72,rep:77},
  {nick:'DOOM',liga:'CBLOL',team:'RED Canids',pos:'Jungle',overall:71,potential:73,rep:52},
  {nick:'Kaze',liga:'CBLOL',team:'RED Canids',pos:'Mid',overall:65,potential:71,rep:55},
  {nick:'Rabelo',liga:'CBLOL',team:'RED Canids',pos:'ADC',overall:63,potential:70,rep:53},
  {nick:'frosty',liga:'CBLOL',team:'RED Canids',pos:'Support',overall:67,potential:73,rep:55},
  {nick:'Boal',liga:'CBLOL',team:'Vivo Keyd',pos:'Top',overall:70,potential:74,rep:76},
  {nick:'Disamis',liga:'CBLOL',team:'Vivo Keyd',pos:'Jungle',overall:59,potential:66,rep:39},
  {nick:'Mireu',liga:'CBLOL',team:'Vivo Keyd',pos:'Mid',overall:58,potential:63,rep:45},
  {nick:'Morttheus',liga:'CBLOL',team:'Vivo Keyd',pos:'ADC',overall:59,potential:59,rep:63},
  {nick:'Kaiwing',liga:'CBLOL',team:'Vivo Keyd',pos:'Support',overall:57,potential:60,rep:43},
  {nick:'curty',liga:'CBLOL',team:'Fluxo',pos:'Top',overall:57,potential:59,rep:44},
  {nick:'Peach',liga:'CBLOL',team:'Fluxo',pos:'Jungle',overall:61,potential:68,rep:62},
  {nick:'Hauz',liga:'CBLOL',team:'Fluxo',pos:'Mid',overall:60,potential:63,rep:54},
  {nick:'Bao',liga:'CBLOL',team:'Fluxo',pos:'ADC',overall:65,potential:70,rep:50},
  {nick:'ProDelta',liga:'CBLOL',team:'Fluxo',pos:'Support',overall:60,potential:62,rep:70},
  {nick:'Devost',liga:'CBLOL',team:'LEVIATÁN',pos:'Top',overall:66,potential:67,rep:64},
  {nick:'Booki',liga:'CBLOL',team:'LEVIATÁN',pos:'Jungle',overall:57,potential:61,rep:55},
  {nick:'Enga',liga:'CBLOL',team:'LEVIATÁN',pos:'Mid',overall:69,potential:75,rep:79},
  {nick:'Ceo',liga:'CBLOL',team:'LEVIATÁN',pos:'ADC',overall:63,potential:64,rep:61},
  {nick:'TopLop',liga:'CBLOL',team:'LEVIATÁN',pos:'Support',overall:64,potential:65,rep:66},
  {nick:'Zest',liga:'CBLOL',team:'LOS',pos:'Top',overall:66,potential:67,rep:71},
  {nick:'Drakehero',liga:'CBLOL',team:'LOS',pos:'Jungle',overall:58,potential:63,rep:55},
  {nick:'Feisty',liga:'CBLOL',team:'LOS',pos:'Mid',overall:70,potential:75,rep:52},
  {nick:'Duduhh',liga:'CBLOL',team:'LOS',pos:'ADC',overall:73,potential:78,rep:53},
  {nick:'Ackerman',liga:'CBLOL',team:'LOS',pos:'Support',overall:70,potential:77,rep:53},
  {nick:'Rest',liga:'LCP',team:'CTBC Flying Oyster',pos:'Top',overall:67,potential:72,rep:67},
  {nick:'Shad0w',liga:'LCP',team:'CTBC Flying Oyster',pos:'Jungle',overall:68,potential:70,rep:61},
  {nick:'Pungyeon',liga:'LCP',team:'CTBC Flying Oyster',pos:'Mid',overall:59,potential:67,rep:69},
  {nick:'Doggo',liga:'LCP',team:'CTBC Flying Oyster',pos:'ADC',overall:62,potential:70,rep:66},
  {nick:'Orca',liga:'LCP',team:'CTBC Flying Oyster',pos:'Support',overall:69,potential:76,rep:62},
  {nick:'Kiaya',liga:'LCP',team:'GAM Esports',pos:'Top',overall:62,potential:67,rep:69},
  {nick:'Draktharr',liga:'LCP',team:'GAM Esports',pos:'Jungle',overall:61,potential:62,rep:49},
  {nick:'Aress',liga:'LCP',team:'GAM Esports',pos:'Mid',overall:68,potential:71,rep:72},
  {nick:'Artemis',liga:'LCP',team:'GAM Esports',pos:'ADC',overall:68,potential:74,rep:58},
  {nick:'Taki',liga:'LCP',team:'GAM Esports',pos:'Support',overall:54,potential:61,rep:61},
  {nick:'Evi',liga:'LCP',team:'Fukuoka SoftBank',pos:'Top',overall:64,potential:66,rep:59},
  {nick:'Van',liga:'LCP',team:'Fukuoka SoftBank',pos:'Jungle',overall:60,potential:65,rep:65},
  {nick:'Aria',liga:'LCP',team:'Fukuoka SoftBank',pos:'Mid',overall:62,potential:67,rep:50},
  {nick:'Marble',liga:'LCP',team:'Fukuoka SoftBank',pos:'ADC',overall:62,potential:70,rep:42},
  {nick:'Vsta',liga:'LCP',team:'Fukuoka SoftBank',pos:'Support',overall:70,potential:73,rep:52},
  {nick:'Ironveil',liga:'LCP',team:'Secret Whales',pos:'Top',overall:61,potential:67,rep:56},
  {nick:'Phantom',liga:'LCP',team:'Secret Whales',pos:'Jungle',overall:61,potential:68,rep:61},
  {nick:'Stormrix',liga:'LCP',team:'Secret Whales',pos:'Mid',overall:69,potential:76,rep:74},
  {nick:'Dawnshot',liga:'LCP',team:'Secret Whales',pos:'ADC',overall:54,potential:55,rep:43},
  {nick:'Tidecaller',liga:'LCP',team:'Secret Whales',pos:'Support',overall:61,potential:67,rep:63},
  {nick:'Obsidian',liga:'LCP',team:'DetonatioN FM',pos:'Top',overall:61,potential:65,rep:62},
  {nick:'Flashpoint',liga:'LCP',team:'DetonatioN FM',pos:'Jungle',overall:65,potential:72,rep:62},
  {nick:'Nullwave',liga:'LCP',team:'DetonatioN FM',pos:'Mid',overall:70,potential:75,rep:63},
  {nick:'Recoil',liga:'LCP',team:'DetonatioN FM',pos:'ADC',overall:64,potential:69,rep:66},
  {nick:'Vigil',liga:'LCP',team:'DetonatioN FM',pos:'Support',overall:68,potential:72,rep:57},
  {nick:'Crestone',liga:'LCP',team:'MVK Esports',pos:'Top',overall:62,potential:65,rep:45},
  {nick:'Razorwing',liga:'LCP',team:'MVK Esports',pos:'Jungle',overall:60,potential:65,rep:43},
  {nick:'Voltex',liga:'LCP',team:'MVK Esports',pos:'Mid',overall:59,potential:62,rep:45},
  {nick:'Mirrorshot',liga:'LCP',team:'MVK Esports',pos:'ADC',overall:69,potential:73,rep:72},
  {nick:'Emberglow',liga:'LCP',team:'MVK Esports',pos:'Support',overall:70,potential:74,rep:53},
  {nick:'Fracture',liga:'LCP',team:'Deep Cross Gaming',pos:'Top',overall:60,potential:64,rep:47},
  {nick:'Crosspath',liga:'LCP',team:'Deep Cross Gaming',pos:'Jungle',overall:65,potential:67,rep:54},
  {nick:'Depthseeker',liga:'LCP',team:'Deep Cross Gaming',pos:'Mid',overall:54,potential:62,rep:38},
  {nick:'Splitmark',liga:'LCP',team:'Deep Cross Gaming',pos:'ADC',overall:62,potential:62,rep:43},
  {nick:'Voidpulse',liga:'LCP',team:'Deep Cross Gaming',pos:'Support',overall:63,potential:65,rep:63},
  {nick:'Ashfall',liga:'LCP',team:'Ground Zero Gaming',pos:'Top',overall:69,potential:70,rep:76},
  {nick:'Groundbreaker',liga:'LCP',team:'Ground Zero Gaming',pos:'Jungle',overall:54,potential:58,rep:49},
  {nick:'Zeronova',liga:'LCP',team:'Ground Zero Gaming',pos:'Mid',overall:69,potential:76,rep:59},
  {nick:'Lastlight',liga:'LCP',team:'Ground Zero Gaming',pos:'ADC',overall:59,potential:59,rep:47},
  {nick:'Bastion',liga:'LCP',team:'Ground Zero Gaming',pos:'Support',overall:69,potential:70,rep:75}
]

const PLAYERS_ACADEMY_FULL = [
  {nick:'Garp',liga:'LCK',team:'T1 Academy',pos:'Top',overall:50,potential:67,rep:41},
  {nick:'Shadow',liga:'LCK',team:'T1 Academy',pos:'Jungle',overall:50,potential:56,rep:19},
  {nick:'Nova',liga:'LCK',team:'T1 Academy',pos:'Mid',overall:52,potential:66,rep:15},
  {nick:'Bolt',liga:'LCK',team:'T1 Academy',pos:'ADC',overall:55,potential:63,rep:45},
  {nick:'Tide',liga:'LCK',team:'T1 Academy',pos:'Support',overall:61,potential:73,rep:43},
  {nick:'Zenith',liga:'LCK',team:'Gen.G Esports Academy',pos:'Top',overall:60,potential:79,rep:38},
  {nick:'Creek',liga:'LCK',team:'Gen.G Esports Academy',pos:'Jungle',overall:57,potential:75,rep:29},
  {nick:'Cipher',liga:'LCK',team:'Gen.G Esports Academy',pos:'Mid',overall:66,potential:72,rep:49},
  {nick:'Flare',liga:'LCK',team:'Gen.G Esports Academy',pos:'ADC',overall:51,potential:62,rep:50},
  {nick:'Omen',liga:'LCK',team:'Gen.G Esports Academy',pos:'Support',overall:54,potential:67,rep:15},
  {nick:'Rift',liga:'LCK',team:'Hanwha Life Academy',pos:'Top',overall:53,potential:65,rep:21},
  {nick:'Wisp',liga:'LCK',team:'Hanwha Life Academy',pos:'Jungle',overall:65,potential:72,rep:20},
  {nick:'Prism',liga:'LCK',team:'Hanwha Life Academy',pos:'Mid',overall:48,potential:66,rep:38},
  {nick:'Tracer',liga:'LCK',team:'Hanwha Life Academy',pos:'ADC',overall:67,potential:87,rep:28},
  {nick:'Grace',liga:'LCK',team:'Hanwha Life Academy',pos:'Support',overall:49,potential:61,rep:28},
  {nick:'Forge',liga:'LCK',team:'KT Rolster Academy',pos:'Top',overall:57,potential:76,rep:14},
  {nick:'Torrent',liga:'LCK',team:'KT Rolster Academy',pos:'Jungle',overall:55,potential:68,rep:50},
  {nick:'Echo',liga:'LCK',team:'KT Rolster Academy',pos:'Mid',overall:66,potential:77,rep:37},
  {nick:'Mark',liga:'LCK',team:'KT Rolster Academy',pos:'ADC',overall:51,potential:63,rep:19},
  {nick:'Halo',liga:'LCK',team:'KT Rolster Academy',pos:'Support',overall:56,potential:65,rep:14},
  {nick:'Storm',liga:'LCK',team:'NS RedForce Academy',pos:'Top',overall:49,potential:59,rep:29},
  {nick:'Fenix',liga:'LCK',team:'NS RedForce Academy',pos:'Jungle',overall:67,potential:81,rep:38},
  {nick:'Lyric',liga:'LCK',team:'NS RedForce Academy',pos:'Mid',overall:51,potential:70,rep:29},
  {nick:'Dash',liga:'LCK',team:'NS RedForce Academy',pos:'ADC',overall:60,potential:73,rep:42},
  {nick:'Link',liga:'LCK',team:'NS RedForce Academy',pos:'Support',overall:65,potential:85,rep:38},
  {nick:'Blaze',liga:'LCK',team:'Dplus KIA Academy',pos:'Top',overall:50,potential:56,rep:37},
  {nick:'Gust',liga:'LCK',team:'Dplus KIA Academy',pos:'Jungle',overall:58,potential:71,rep:11},
  {nick:'Vex',liga:'LCK',team:'Dplus KIA Academy',pos:'Mid',overall:50,potential:62,rep:46},
  {nick:'Pulse',liga:'LCK',team:'Dplus KIA Academy',pos:'ADC',overall:66,potential:71,rep:27},
  {nick:'Ward',liga:'LCK',team:'Dplus KIA Academy',pos:'Support',overall:66,potential:72,rep:21},
  {nick:'Void',liga:'LCK',team:'DN SOOPers Academy',pos:'Top',overall:63,potential:82,rep:27},
  {nick:'Flux',liga:'LCK',team:'DN SOOPers Academy',pos:'Jungle',overall:53,potential:71,rep:50},
  {nick:'Rune',liga:'LCK',team:'DN SOOPers Academy',pos:'Mid',overall:63,potential:70,rep:40},
  {nick:'Beam',liga:'LCK',team:'DN SOOPers Academy',pos:'ADC',overall:59,potential:77,rep:31},
  {nick:'Boon',liga:'LCK',team:'DN SOOPers Academy',pos:'Support',overall:58,potential:66,rep:20},
  {nick:'Arc',liga:'LCK',team:'DRX Academy',pos:'Top',overall:58,potential:76,rep:41},
  {nick:'Shadow2',liga:'LCK',team:'DRX Academy',pos:'Jungle',overall:57,potential:74,rep:45},
  {nick:'Nova2',liga:'LCK',team:'DRX Academy',pos:'Mid',overall:49,potential:68,rep:15},
  {nick:'Bolt2',liga:'LCK',team:'DRX Academy',pos:'ADC',overall:58,potential:71,rep:30},
  {nick:'Tide2',liga:'LCK',team:'DRX Academy',pos:'Support',overall:51,potential:68,rep:42},
  {nick:'Garp2',liga:'LCK',team:'FEARX Academy',pos:'Top',overall:48,potential:67,rep:36},
  {nick:'Creek2',liga:'LCK',team:'FEARX Academy',pos:'Jungle',overall:49,potential:60,rep:43},
  {nick:'Cipher2',liga:'LCK',team:'FEARX Academy',pos:'Mid',overall:59,potential:79,rep:50},
  {nick:'Flare2',liga:'LCK',team:'FEARX Academy',pos:'ADC',overall:62,potential:68,rep:23},
  {nick:'Omen2',liga:'LCK',team:'FEARX Academy',pos:'Support',overall:56,potential:65,rep:28},
  {nick:'Zenith2',liga:'LCK',team:'OKSavingsBank BRION Academy',pos:'Top',overall:62,potential:82,rep:17},
  {nick:'Wisp2',liga:'LCK',team:'OKSavingsBank BRION Academy',pos:'Jungle',overall:48,potential:60,rep:20},
  {nick:'Prism2',liga:'LCK',team:'OKSavingsBank BRION Academy',pos:'Mid',overall:57,potential:62,rep:45},
  {nick:'Tracer2',liga:'LCK',team:'OKSavingsBank BRION Academy',pos:'ADC',overall:61,potential:68,rep:24},
  {nick:'Grace2',liga:'LCK',team:'OKSavingsBank BRION Academy',pos:'Support',overall:51,potential:70,rep:17},
  {nick:'Rift2',liga:'LPL',team:'Bilibili Gaming Academy',pos:'Top',overall:70,potential:79,rep:41},
  {nick:'Torrent2',liga:'LPL',team:'Bilibili Gaming Academy',pos:'Jungle',overall:59,potential:72,rep:36},
  {nick:'Echo2',liga:'LPL',team:'Bilibili Gaming Academy',pos:'Mid',overall:65,potential:85,rep:25},
  {nick:'Mark2',liga:'LPL',team:'Bilibili Gaming Academy',pos:'ADC',overall:64,potential:73,rep:34},
  {nick:'Halo2',liga:'LPL',team:'Bilibili Gaming Academy',pos:'Support',overall:56,potential:65,rep:14},
  {nick:'Forge2',liga:'LPL',team:"Anyone's Legend Academy",pos:'Top',overall:58,potential:76,rep:31},
  {nick:'Fenix2',liga:'LPL',team:"Anyone's Legend Academy",pos:'Jungle',overall:66,potential:79,rep:10},
  {nick:'Lyric2',liga:'LPL',team:"Anyone's Legend Academy",pos:'Mid',overall:59,potential:73,rep:47},
  {nick:'Dash2',liga:'LPL',team:"Anyone's Legend Academy",pos:'ADC',overall:68,potential:88,rep:19},
  {nick:'Link2',liga:'LPL',team:"Anyone's Legend Academy",pos:'Support',overall:64,potential:84,rep:32},
  {nick:'Storm2',liga:'LPL',team:'JD Gaming Academy',pos:'Top',overall:60,potential:77,rep:39},
  {nick:'Gust2',liga:'LPL',team:'JD Gaming Academy',pos:'Jungle',overall:60,potential:71,rep:25},
  {nick:'Vex2',liga:'LPL',team:'JD Gaming Academy',pos:'Mid',overall:68,potential:85,rep:24},
  {nick:'Pulse2',liga:'LPL',team:'JD Gaming Academy',pos:'ADC',overall:63,potential:69,rep:30},
  {nick:'Ward2',liga:'LPL',team:'JD Gaming Academy',pos:'Support',overall:65,potential:82,rep:34},
  {nick:'Blaze2',liga:'LPL',team:'Top Esports Academy',pos:'Top',overall:70,potential:79,rep:41},
  {nick:'Flux2',liga:'LPL',team:'Top Esports Academy',pos:'Jungle',overall:51,potential:60,rep:42},
  {nick:'Rune2',liga:'LPL',team:'Top Esports Academy',pos:'Mid',overall:68,potential:83,rep:16},
  {nick:'Beam2',liga:'LPL',team:'Top Esports Academy',pos:'ADC',overall:64,potential:72,rep:43},
  {nick:'Boon2',liga:'LPL',team:'Top Esports Academy',pos:'Support',overall:64,potential:69,rep:19},
  {nick:'Void2',liga:'LPL',team:'Weibo Gaming Academy',pos:'Top',overall:63,potential:72,rep:14},
  {nick:'Shadow3',liga:'LPL',team:'Weibo Gaming Academy',pos:'Jungle',overall:65,potential:78,rep:31},
  {nick:'Nova3',liga:'LPL',team:'Weibo Gaming Academy',pos:'Mid',overall:69,potential:86,rep:15},
  {nick:'Bolt3',liga:'LPL',team:'Weibo Gaming Academy',pos:'ADC',overall:60,potential:77,rep:30},
  {nick:'Tide3',liga:'LPL',team:'Weibo Gaming Academy',pos:'Support',overall:70,potential:90,rep:44},
  {nick:'Arc2',liga:'LPL',team:'EDward Gaming Academy',pos:'Top',overall:51,potential:58,rep:25},
  {nick:'Creek3',liga:'LPL',team:'EDward Gaming Academy',pos:'Jungle',overall:70,potential:84,rep:24},
  {nick:'Cipher3',liga:'LPL',team:'EDward Gaming Academy',pos:'Mid',overall:52,potential:70,rep:16},
  {nick:'Flare3',liga:'LPL',team:'EDward Gaming Academy',pos:'ADC',overall:70,potential:78,rep:38},
  {nick:'Omen3',liga:'LPL',team:'EDward Gaming Academy',pos:'Support',overall:55,potential:69,rep:11},
  {nick:'Garp3',liga:'LPL',team:'Invictus Gaming Academy',pos:'Top',overall:51,potential:66,rep:13},
  {nick:'Wisp3',liga:'LPL',team:'Invictus Gaming Academy',pos:'Jungle',overall:59,potential:75,rep:33},
  {nick:'Prism3',liga:'LPL',team:'Invictus Gaming Academy',pos:'Mid',overall:63,potential:72,rep:25},
  {nick:'Tracer3',liga:'LPL',team:'Invictus Gaming Academy',pos:'ADC',overall:66,potential:84,rep:46},
  {nick:'Grace3',liga:'LPL',team:'Invictus Gaming Academy',pos:'Support',overall:55,potential:65,rep:21},
  {nick:'Zenith3',liga:'LPL',team:'LGD Gaming Academy',pos:'Top',overall:52,potential:69,rep:49},
  {nick:'Torrent3',liga:'LPL',team:'LGD Gaming Academy',pos:'Jungle',overall:57,potential:77,rep:47},
  {nick:'Echo3',liga:'LPL',team:'LGD Gaming Academy',pos:'Mid',overall:54,potential:66,rep:39},
  {nick:'Mark3',liga:'LPL',team:'LGD Gaming Academy',pos:'ADC',overall:70,potential:83,rep:39},
  {nick:'Halo3',liga:'LPL',team:'LGD Gaming Academy',pos:'Support',overall:58,potential:63,rep:39},
  {nick:'Rift3',liga:'LPL',team:'LNG Esports Academy',pos:'Top',overall:59,potential:69,rep:14},
  {nick:'Fenix3',liga:'LPL',team:'LNG Esports Academy',pos:'Jungle',overall:64,potential:80,rep:47},
  {nick:'Lyric3',liga:'LPL',team:'LNG Esports Academy',pos:'Mid',overall:59,potential:77,rep:26},
  {nick:'Dash3',liga:'LPL',team:'LNG Esports Academy',pos:'ADC',overall:64,potential:78,rep:22},
  {nick:'Link3',liga:'LPL',team:'LNG Esports Academy',pos:'Support',overall:62,potential:82,rep:16},
  {nick:'Forge3',liga:'LPL',team:'Oh My God Academy',pos:'Top',overall:57,potential:74,rep:46},
  {nick:'Gust3',liga:'LPL',team:'Oh My God Academy',pos:'Jungle',overall:61,potential:75,rep:28},
  {nick:'Vex3',liga:'LPL',team:'Oh My God Academy',pos:'Mid',overall:50,potential:67,rep:27},
  {nick:'Pulse3',liga:'LPL',team:'Oh My God Academy',pos:'ADC',overall:50,potential:56,rep:48},
  {nick:'Ward3',liga:'LPL',team:'Oh My God Academy',pos:'Support',overall:65,potential:79,rep:24},
  {nick:'Storm3',liga:'LPL',team:'Ultra Prime Academy',pos:'Top',overall:69,potential:85,rep:24},
  {nick:'Flux3',liga:'LPL',team:'Ultra Prime Academy',pos:'Jungle',overall:70,potential:81,rep:49},
  {nick:'Rune3',liga:'LPL',team:'Ultra Prime Academy',pos:'Mid',overall:58,potential:67,rep:50},
  {nick:'Beam3',liga:'LPL',team:'Ultra Prime Academy',pos:'ADC',overall:53,potential:59,rep:29},
  {nick:'Boon3',liga:'LPL',team:'Ultra Prime Academy',pos:'Support',overall:64,potential:70,rep:47},
  {nick:'Blaze3',liga:'LPL',team:'ThunderTalk Academy',pos:'Top',overall:61,potential:70,rep:15},
  {nick:'Shadow4',liga:'LPL',team:'ThunderTalk Academy',pos:'Jungle',overall:59,potential:74,rep:36},
  {nick:'Nova4',liga:'LPL',team:'ThunderTalk Academy',pos:'Mid',overall:55,potential:66,rep:18},
  {nick:'Bolt4',liga:'LPL',team:'ThunderTalk Academy',pos:'ADC',overall:67,potential:83,rep:43},
  {nick:'Tide4',liga:'LPL',team:'ThunderTalk Academy',pos:'Support',overall:66,potential:79,rep:20},
  {nick:'Void3',liga:'LPL',team:'Ninjas in Pyjamas Academy',pos:'Top',overall:58,potential:78,rep:28},
  {nick:'Creek4',liga:'LPL',team:'Ninjas in Pyjamas Academy',pos:'Jungle',overall:60,potential:68,rep:39},
  {nick:'Cipher4',liga:'LPL',team:'Ninjas in Pyjamas Academy',pos:'Mid',overall:52,potential:61,rep:24},
  {nick:'Flare4',liga:'LPL',team:'Ninjas in Pyjamas Academy',pos:'ADC',overall:62,potential:78,rep:15},
  {nick:'Omen4',liga:'LPL',team:'Ninjas in Pyjamas Academy',pos:'Support',overall:62,potential:67,rep:26},
  {nick:'Arc3',liga:'LPL',team:'Team WE Academy',pos:'Top',overall:67,potential:75,rep:39},
  {nick:'Wisp4',liga:'LPL',team:'Team WE Academy',pos:'Jungle',overall:61,potential:74,rep:47},
  {nick:'Prism4',liga:'LPL',team:'Team WE Academy',pos:'Mid',overall:62,potential:78,rep:16},
  {nick:'Tracer4',liga:'LPL',team:'Team WE Academy',pos:'ADC',overall:57,potential:77,rep:11},
  {nick:'Grace4',liga:'LPL',team:'Team WE Academy',pos:'Support',overall:69,potential:84,rep:49},
  {nick:'Garp4',liga:'LEC',team:'G2 Esports Academy',pos:'Top',overall:53,potential:60,rep:50},
  {nick:'Torrent4',liga:'LEC',team:'G2 Esports Academy',pos:'Jungle',overall:60,potential:74,rep:36},
  {nick:'Echo4',liga:'LEC',team:'G2 Esports Academy',pos:'Mid',overall:49,potential:58,rep:12},
  {nick:'Mark4',liga:'LEC',team:'G2 Esports Academy',pos:'ADC',overall:47,potential:61,rep:41},
  {nick:'Halo4',liga:'LEC',team:'G2 Esports Academy',pos:'Support',overall:49,potential:57,rep:25},
  {nick:'Zenith4',liga:'LEC',team:'Fnatic Academy',pos:'Top',overall:63,potential:72,rep:34},
  {nick:'Fenix4',liga:'LEC',team:'Fnatic Academy',pos:'Jungle',overall:60,potential:76,rep:44},
  {nick:'Lyric4',liga:'LEC',team:'Fnatic Academy',pos:'Mid',overall:59,potential:68,rep:36},
  {nick:'Dash4',liga:'LEC',team:'Fnatic Academy',pos:'ADC',overall:66,potential:74,rep:41},
  {nick:'Link4',liga:'LEC',team:'Fnatic Academy',pos:'Support',overall:65,potential:83,rep:27},
  {nick:'Rift4',liga:'LEC',team:'Movistar KOI Academy',pos:'Top',overall:47,potential:63,rep:23},
  {nick:'Gust4',liga:'LEC',team:'Movistar KOI Academy',pos:'Jungle',overall:60,potential:79,rep:25},
  {nick:'Vex4',liga:'LEC',team:'Movistar KOI Academy',pos:'Mid',overall:57,potential:65,rep:33},
  {nick:'Pulse4',liga:'LEC',team:'Movistar KOI Academy',pos:'ADC',overall:63,potential:79,rep:13},
  {nick:'Ward4',liga:'LEC',team:'Movistar KOI Academy',pos:'Support',overall:58,potential:71,rep:22},
  {nick:'Forge4',liga:'LEC',team:'Karmine Corp Academy',pos:'Top',overall:49,potential:68,rep:15},
  {nick:'Flux4',liga:'LEC',team:'Karmine Corp Academy',pos:'Jungle',overall:52,potential:57,rep:13},
  {nick:'Rune4',liga:'LEC',team:'Karmine Corp Academy',pos:'Mid',overall:56,potential:68,rep:18},
  {nick:'Beam4',liga:'LEC',team:'Karmine Corp Academy',pos:'ADC',overall:64,potential:75,rep:14},
  {nick:'Boon4',liga:'LEC',team:'Karmine Corp Academy',pos:'Support',overall:63,potential:74,rep:47},
  {nick:'Storm4',liga:'LEC',team:'SK Gaming Academy',pos:'Top',overall:52,potential:64,rep:31},
  {nick:'Shadow5',liga:'LEC',team:'SK Gaming Academy',pos:'Jungle',overall:50,potential:55,rep:27},
  {nick:'Nova5',liga:'LEC',team:'SK Gaming Academy',pos:'Mid',overall:50,potential:59,rep:44},
  {nick:'Bolt5',liga:'LEC',team:'SK Gaming Academy',pos:'ADC',overall:54,potential:64,rep:17},
  {nick:'Tide5',liga:'LEC',team:'SK Gaming Academy',pos:'Support',overall:46,potential:55,rep:10},
  {nick:'Blaze4',liga:'LEC',team:'GIANTX Academy',pos:'Top',overall:57,potential:69,rep:47},
  {nick:'Creek5',liga:'LEC',team:'GIANTX Academy',pos:'Jungle',overall:56,potential:61,rep:21},
  {nick:'Cipher5',liga:'LEC',team:'GIANTX Academy',pos:'Mid',overall:54,potential:60,rep:18},
  {nick:'Flare5',liga:'LEC',team:'GIANTX Academy',pos:'ADC',overall:59,potential:67,rep:14},
  {nick:'Omen5',liga:'LEC',team:'GIANTX Academy',pos:'Support',overall:61,potential:80,rep:33},
  {nick:'Void4',liga:'LEC',team:'Team Vitality Academy',pos:'Top',overall:62,potential:70,rep:38},
  {nick:'Wisp5',liga:'LEC',team:'Team Vitality Academy',pos:'Jungle',overall:62,potential:74,rep:49},
  {nick:'Prism5',liga:'LEC',team:'Team Vitality Academy',pos:'Mid',overall:47,potential:61,rep:39},
  {nick:'Tracer5',liga:'LEC',team:'Team Vitality Academy',pos:'ADC',overall:66,potential:71,rep:13},
  {nick:'Grace5',liga:'LEC',team:'Team Vitality Academy',pos:'Support',overall:61,potential:78,rep:37},
  {nick:'Arc4',liga:'LEC',team:'Shifters Academy',pos:'Top',overall:49,potential:69,rep:38},
  {nick:'Torrent5',liga:'LEC',team:'Shifters Academy',pos:'Jungle',overall:48,potential:55,rep:30},
  {nick:'Echo5',liga:'LEC',team:'Shifters Academy',pos:'Mid',overall:65,potential:74,rep:14},
  {nick:'Mark5',liga:'LEC',team:'Shifters Academy',pos:'ADC',overall:50,potential:63,rep:49},
  {nick:'Halo5',liga:'LEC',team:'Shifters Academy',pos:'Support',overall:66,potential:81,rep:34},
  {nick:'Garp5',liga:'LEC',team:'Team Heretics Academy',pos:'Top',overall:65,potential:79,rep:39},
  {nick:'Fenix5',liga:'LEC',team:'Team Heretics Academy',pos:'Jungle',overall:62,potential:80,rep:16},
  {nick:'Lyric5',liga:'LEC',team:'Team Heretics Academy',pos:'Mid',overall:49,potential:60,rep:37},
  {nick:'Dash5',liga:'LEC',team:'Team Heretics Academy',pos:'ADC',overall:60,potential:72,rep:36},
  {nick:'Link5',liga:'LEC',team:'Team Heretics Academy',pos:'Support',overall:56,potential:75,rep:35},
  {nick:'Zenith5',liga:'LEC',team:'Natus Vincere Academy',pos:'Top',overall:59,potential:67,rep:30},
  {nick:'Gust5',liga:'LEC',team:'Natus Vincere Academy',pos:'Jungle',overall:59,potential:74,rep:26},
  {nick:'Vex5',liga:'LEC',team:'Natus Vincere Academy',pos:'Mid',overall:57,potential:66,rep:40},
  {nick:'Pulse5',liga:'LEC',team:'Natus Vincere Academy',pos:'ADC',overall:48,potential:55,rep:15},
  {nick:'Ward5',liga:'LEC',team:'Natus Vincere Academy',pos:'Support',overall:48,potential:66,rep:16},
  {nick:'Rift5',liga:'LCS',team:'LYON Academy',pos:'Top',overall:55,potential:64,rep:45},
  {nick:'Flux5',liga:'LCS',team:'LYON Academy',pos:'Jungle',overall:45,potential:60,rep:17},
  {nick:'Rune5',liga:'LCS',team:'LYON Academy',pos:'Mid',overall:57,potential:73,rep:37},
  {nick:'Beam5',liga:'LCS',team:'LYON Academy',pos:'ADC',overall:45,potential:59,rep:48},
  {nick:'Boon5',liga:'LCS',team:'LYON Academy',pos:'Support',overall:53,potential:69,rep:16},
  {nick:'Forge5',liga:'LCS',team:'Cloud9 Academy',pos:'Top',overall:62,potential:73,rep:19},
  {nick:'Shadow6',liga:'LCS',team:'Cloud9 Academy',pos:'Jungle',overall:59,potential:71,rep:16},
  {nick:'Nova6',liga:'LCS',team:'Cloud9 Academy',pos:'Mid',overall:55,potential:71,rep:17},
  {nick:'Bolt6',liga:'LCS',team:'Cloud9 Academy',pos:'ADC',overall:52,potential:64,rep:37},
  {nick:'Tide6',liga:'LCS',team:'Cloud9 Academy',pos:'Support',overall:61,potential:66,rep:48},
  {nick:'Storm5',liga:'LCS',team:'Team Liquid Academy',pos:'Top',overall:52,potential:57,rep:21},
  {nick:'Creek6',liga:'LCS',team:'Team Liquid Academy',pos:'Jungle',overall:52,potential:66,rep:31},
  {nick:'Cipher6',liga:'LCS',team:'Team Liquid Academy',pos:'Mid',overall:55,potential:60,rep:21},
  {nick:'Flare6',liga:'LCS',team:'Team Liquid Academy',pos:'ADC',overall:48,potential:65,rep:14},
  {nick:'Omen6',liga:'LCS',team:'Team Liquid Academy',pos:'Support',overall:48,potential:53,rep:15},
  {nick:'Blaze5',liga:'LCS',team:'FlyQuest Academy',pos:'Top',overall:60,potential:71,rep:34},
  {nick:'Wisp6',liga:'LCS',team:'FlyQuest Academy',pos:'Jungle',overall:57,potential:76,rep:31},
  {nick:'Prism6',liga:'LCS',team:'FlyQuest Academy',pos:'Mid',overall:49,potential:65,rep:29},
  {nick:'Tracer6',liga:'LCS',team:'FlyQuest Academy',pos:'ADC',overall:54,potential:61,rep:13},
  {nick:'Grace6',liga:'LCS',team:'FlyQuest Academy',pos:'Support',overall:48,potential:58,rep:49},
  {nick:'Void5',liga:'LCS',team:'Dignitas Academy',pos:'Top',overall:45,potential:52,rep:27},
  {nick:'Torrent6',liga:'LCS',team:'Dignitas Academy',pos:'Jungle',overall:58,potential:76,rep:41},
  {nick:'Echo6',liga:'LCS',team:'Dignitas Academy',pos:'Mid',overall:63,potential:82,rep:36},
  {nick:'Mark6',liga:'LCS',team:'Dignitas Academy',pos:'ADC',overall:52,potential:63,rep:42},
  {nick:'Halo6',liga:'LCS',team:'Dignitas Academy',pos:'Support',overall:47,potential:63,rep:37},
  {nick:'Arc5',liga:'LCS',team:'Sentinels Academy',pos:'Top',overall:47,potential:61,rep:47},
  {nick:'Fenix6',liga:'LCS',team:'Sentinels Academy',pos:'Jungle',overall:59,potential:73,rep:12},
  {nick:'Lyric6',liga:'LCS',team:'Sentinels Academy',pos:'Mid',overall:51,potential:68,rep:48},
  {nick:'Dash6',liga:'LCS',team:'Sentinels Academy',pos:'ADC',overall:45,potential:50,rep:23},
  {nick:'Link6',liga:'LCS',team:'Sentinels Academy',pos:'Support',overall:53,potential:64,rep:18},
  {nick:'Garp6',liga:'LCS',team:'Shopify Rebellion Academy',pos:'Top',overall:52,potential:66,rep:30},
  {nick:'Gust6',liga:'LCS',team:'Shopify Rebellion Academy',pos:'Jungle',overall:47,potential:52,rep:41},
  {nick:'Vex6',liga:'LCS',team:'Shopify Rebellion Academy',pos:'Mid',overall:57,potential:67,rep:18},
  {nick:'Pulse6',liga:'LCS',team:'Shopify Rebellion Academy',pos:'ADC',overall:56,potential:68,rep:42},
  {nick:'Ward6',liga:'LCS',team:'Shopify Rebellion Academy',pos:'Support',overall:61,potential:77,rep:14},
  {nick:'Zenith6',liga:'LCS',team:'Disguised Academy',pos:'Top',overall:56,potential:62,rep:37},
  {nick:'Flux6',liga:'LCS',team:'Disguised Academy',pos:'Jungle',overall:44,potential:63,rep:14},
  {nick:'Rune6',liga:'LCS',team:'Disguised Academy',pos:'Mid',overall:54,potential:72,rep:46},
  {nick:'Beam6',liga:'LCS',team:'Disguised Academy',pos:'ADC',overall:56,potential:74,rep:28},
  {nick:'Boon6',liga:'LCS',team:'Disguised Academy',pos:'Support',overall:47,potential:64,rep:11},
  {nick:'Rift6',liga:'CBLOL',team:'LOUD Academy',pos:'Top',overall:50,potential:60,rep:49},
  {nick:'Shadow7',liga:'CBLOL',team:'LOUD Academy',pos:'Jungle',overall:54,potential:70,rep:15},
  {nick:'Nova7',liga:'CBLOL',team:'LOUD Academy',pos:'Mid',overall:53,potential:61,rep:25},
  {nick:'Bolt7',liga:'CBLOL',team:'LOUD Academy',pos:'ADC',overall:53,potential:70,rep:43},
  {nick:'Tide7',liga:'CBLOL',team:'LOUD Academy',pos:'Support',overall:42,potential:59,rep:29},
  {nick:'Forge6',liga:'CBLOL',team:'paiN Gaming Academy',pos:'Top',overall:50,potential:62,rep:31},
  {nick:'Creek7',liga:'CBLOL',team:'paiN Gaming Academy',pos:'Jungle',overall:45,potential:52,rep:42},
  {nick:'Cipher7',liga:'CBLOL',team:'paiN Gaming Academy',pos:'Mid',overall:60,potential:68,rep:43},
  {nick:'Flare7',liga:'CBLOL',team:'paiN Gaming Academy',pos:'ADC',overall:56,potential:67,rep:32},
  {nick:'Omen7',liga:'CBLOL',team:'paiN Gaming Academy',pos:'Support',overall:51,potential:60,rep:25},
  {nick:'Storm6',liga:'CBLOL',team:'FURIA Academy',pos:'Top',overall:43,potential:52,rep:26},
  {nick:'Wisp7',liga:'CBLOL',team:'FURIA Academy',pos:'Jungle',overall:46,potential:56,rep:48},
  {nick:'Prism7',liga:'CBLOL',team:'FURIA Academy',pos:'Mid',overall:44,potential:51,rep:21},
  {nick:'Tracer7',liga:'CBLOL',team:'FURIA Academy',pos:'ADC',overall:60,potential:80,rep:39},
  {nick:'Grace7',liga:'CBLOL',team:'FURIA Academy',pos:'Support',overall:58,potential:77,rep:46},
  {nick:'Blaze6',liga:'CBLOL',team:'RED Canids Academy',pos:'Top',overall:60,potential:75,rep:50},
  {nick:'Torrent7',liga:'CBLOL',team:'RED Canids Academy',pos:'Jungle',overall:50,potential:59,rep:38},
  {nick:'Echo7',liga:'CBLOL',team:'RED Canids Academy',pos:'Mid',overall:42,potential:62,rep:38},
  {nick:'Mark7',liga:'CBLOL',team:'RED Canids Academy',pos:'ADC',overall:60,potential:74,rep:27},
  {nick:'Halo7',liga:'CBLOL',team:'RED Canids Academy',pos:'Support',overall:58,potential:64,rep:32},
  {nick:'Void6',liga:'CBLOL',team:'Vivo Keyd Academy',pos:'Top',overall:56,potential:63,rep:29},
  {nick:'Fenix7',liga:'CBLOL',team:'Vivo Keyd Academy',pos:'Jungle',overall:54,potential:73,rep:12},
  {nick:'Lyric7',liga:'CBLOL',team:'Vivo Keyd Academy',pos:'Mid',overall:41,potential:57,rep:28},
  {nick:'Dash7',liga:'CBLOL',team:'Vivo Keyd Academy',pos:'ADC',overall:42,potential:49,rep:49},
  {nick:'Link7',liga:'CBLOL',team:'Vivo Keyd Academy',pos:'Support',overall:59,potential:76,rep:39},
  {nick:'Arc6',liga:'CBLOL',team:'Fluxo Academy',pos:'Top',overall:58,potential:64,rep:38},
  {nick:'Gust7',liga:'CBLOL',team:'Fluxo Academy',pos:'Jungle',overall:58,potential:69,rep:30},
  {nick:'Vex7',liga:'CBLOL',team:'Fluxo Academy',pos:'Mid',overall:59,potential:79,rep:42},
  {nick:'Pulse7',liga:'CBLOL',team:'Fluxo Academy',pos:'ADC',overall:44,potential:50,rep:38},
  {nick:'Ward7',liga:'CBLOL',team:'Fluxo Academy',pos:'Support',overall:43,potential:58,rep:15},
  {nick:'Garp7',liga:'CBLOL',team:'LEVIATÁN Academy',pos:'Top',overall:56,potential:66,rep:12},
  {nick:'Flux7',liga:'CBLOL',team:'LEVIATÁN Academy',pos:'Jungle',overall:47,potential:66,rep:38},
  {nick:'Rune7',liga:'CBLOL',team:'LEVIATÁN Academy',pos:'Mid',overall:56,potential:66,rep:33},
  {nick:'Beam7',liga:'CBLOL',team:'LEVIATÁN Academy',pos:'ADC',overall:51,potential:65,rep:34},
  {nick:'Boon7',liga:'CBLOL',team:'LEVIATÁN Academy',pos:'Support',overall:53,potential:68,rep:48},
  {nick:'Zenith7',liga:'CBLOL',team:'LOS Academy',pos:'Top',overall:41,potential:56,rep:14},
  {nick:'Shadow8',liga:'CBLOL',team:'LOS Academy',pos:'Jungle',overall:50,potential:58,rep:45},
  {nick:'Nova8',liga:'CBLOL',team:'LOS Academy',pos:'Mid',overall:52,potential:66,rep:26},
  {nick:'Bolt8',liga:'CBLOL',team:'LOS Academy',pos:'ADC',overall:59,potential:68,rep:31},
  {nick:'Tide8',liga:'CBLOL',team:'LOS Academy',pos:'Support',overall:42,potential:51,rep:32},
  {nick:'Rift7',liga:'LCP',team:'CTBC Flying Oyster Academy',pos:'Top',overall:47,potential:64,rep:18},
  {nick:'Creek8',liga:'LCP',team:'CTBC Flying Oyster Academy',pos:'Jungle',overall:57,potential:64,rep:29},
  {nick:'Cipher8',liga:'LCP',team:'CTBC Flying Oyster Academy',pos:'Mid',overall:55,potential:72,rep:31},
  {nick:'Flare8',liga:'LCP',team:'CTBC Flying Oyster Academy',pos:'ADC',overall:42,potential:49,rep:37},
  {nick:'Omen8',liga:'LCP',team:'CTBC Flying Oyster Academy',pos:'Support',overall:54,potential:70,rep:11},
  {nick:'Forge7',liga:'LCP',team:'GAM Esports Academy',pos:'Top',overall:49,potential:63,rep:21},
  {nick:'Wisp8',liga:'LCP',team:'GAM Esports Academy',pos:'Jungle',overall:44,potential:59,rep:41},
  {nick:'Prism8',liga:'LCP',team:'GAM Esports Academy',pos:'Mid',overall:44,potential:56,rep:18},
  {nick:'Tracer8',liga:'LCP',team:'GAM Esports Academy',pos:'ADC',overall:42,potential:49,rep:28},
  {nick:'Grace8',liga:'LCP',team:'GAM Esports Academy',pos:'Support',overall:41,potential:47,rep:31},
  {nick:'Storm7',liga:'LCP',team:'Fukuoka SoftBank Academy',pos:'Top',overall:57,potential:66,rep:48},
  {nick:'Torrent8',liga:'LCP',team:'Fukuoka SoftBank Academy',pos:'Jungle',overall:50,potential:59,rep:20},
  {nick:'Echo8',liga:'LCP',team:'Fukuoka SoftBank Academy',pos:'Mid',overall:43,potential:53,rep:38},
  {nick:'Mark8',liga:'LCP',team:'Fukuoka SoftBank Academy',pos:'ADC',overall:39,potential:57,rep:33},
  {nick:'Halo8',liga:'LCP',team:'Fukuoka SoftBank Academy',pos:'Support',overall:45,potential:64,rep:49},
  {nick:'Blaze7',liga:'LCP',team:'Secret Whales Academy',pos:'Top',overall:47,potential:66,rep:24},
  {nick:'Fenix8',liga:'LCP',team:'Secret Whales Academy',pos:'Jungle',overall:55,potential:67,rep:29},
  {nick:'Lyric8',liga:'LCP',team:'Secret Whales Academy',pos:'Mid',overall:53,potential:64,rep:33},
  {nick:'Dash8',liga:'LCP',team:'Secret Whales Academy',pos:'ADC',overall:56,potential:75,rep:39},
  {nick:'Link8',liga:'LCP',team:'Secret Whales Academy',pos:'Support',overall:47,potential:64,rep:42},
  {nick:'Void7',liga:'LCP',team:'DetonatioN FM Academy',pos:'Top',overall:54,potential:72,rep:20},
  {nick:'Gust8',liga:'LCP',team:'DetonatioN FM Academy',pos:'Jungle',overall:44,potential:53,rep:26},
  {nick:'Vex8',liga:'LCP',team:'DetonatioN FM Academy',pos:'Mid',overall:39,potential:59,rep:33},
  {nick:'Pulse8',liga:'LCP',team:'DetonatioN FM Academy',pos:'ADC',overall:55,potential:63,rep:43},
  {nick:'Ward8',liga:'LCP',team:'DetonatioN FM Academy',pos:'Support',overall:41,potential:55,rep:15},
  {nick:'Arc7',liga:'LCP',team:'MVK Esports Academy',pos:'Top',overall:43,potential:56,rep:38},
  {nick:'Flux8',liga:'LCP',team:'MVK Esports Academy',pos:'Jungle',overall:54,potential:63,rep:37},
  {nick:'Rune8',liga:'LCP',team:'MVK Esports Academy',pos:'Mid',overall:40,potential:52,rep:38},
  {nick:'Beam8',liga:'LCP',team:'MVK Esports Academy',pos:'ADC',overall:49,potential:54,rep:36},
  {nick:'Boon8',liga:'LCP',team:'MVK Esports Academy',pos:'Support',overall:39,potential:56,rep:42},
  {nick:'Garp8',liga:'LCP',team:'Deep Cross Gaming Academy',pos:'Top',overall:49,potential:61,rep:34},
  {nick:'Shadow9',liga:'LCP',team:'Deep Cross Gaming Academy',pos:'Jungle',overall:40,potential:56,rep:24},
  {nick:'Nova9',liga:'LCP',team:'Deep Cross Gaming Academy',pos:'Mid',overall:38,potential:53,rep:16},
  {nick:'Bolt9',liga:'LCP',team:'Deep Cross Gaming Academy',pos:'ADC',overall:58,potential:73,rep:19},
  {nick:'Tide9',liga:'LCP',team:'Deep Cross Gaming Academy',pos:'Support',overall:42,potential:48,rep:28},
  {nick:'Zenith8',liga:'LCP',team:'Ground Zero Gaming Academy',pos:'Top',overall:53,potential:62,rep:40},
  {nick:'Creek9',liga:'LCP',team:'Ground Zero Gaming Academy',pos:'Jungle',overall:52,potential:57,rep:15},
  {nick:'Cipher9',liga:'LCP',team:'Ground Zero Gaming Academy',pos:'Mid',overall:38,potential:51,rep:23},
  {nick:'Flare9',liga:'LCP',team:'Ground Zero Gaming Academy',pos:'ADC',overall:42,potential:60,rep:17},
  {nick:'Omen9',liga:'LCP',team:'Ground Zero Gaming Academy',pos:'Support',overall:47,potential:59,rep:29}
]


// Teams map for cascading filter
const TEAMS_BY_LEAGUE: Record<string, string[]> = {
  LCK:   ['T1','Gen.G Esports','Hanwha Life','KT Rolster','NS RedForce','Dplus KIA','DN SOOPers','DRX','FEARX','OKSavingsBank BRION'],
  LPL:   ['Bilibili Gaming',"Anyone's Legend",'JD Gaming','Top Esports','Weibo Gaming','EDward Gaming','Invictus Gaming','LGD Gaming','LNG Esports','Oh My God','Ultra Prime','ThunderTalk','Ninjas in Pyjamas','Team WE'],
  LEC:   ['G2 Esports','Fnatic','Movistar KOI','Karmine Corp','SK Gaming','GIANTX','Team Vitality','Shifters','Team Heretics','Natus Vincere'],
  LCS:   ['LYON','Cloud9','Team Liquid','FlyQuest','Dignitas','Sentinels','Shopify Rebellion','Disguised'],
  CBLOL: ['LOUD','paiN Gaming','FURIA','RED Canids','Vivo Keyd','Fluxo','LEVIATÁN','LOS'],
  LCP:   ['CTBC Flying Oyster','GAM Esports','Fukuoka SoftBank','Secret Whales','DetonatioN FM','MVK Esports','Deep Cross Gaming','Ground Zero Gaming'],
}

const ALL_LEAGUES = ['LCK','LPL','LEC','LCS','CBLOL','LCP']

function PanelJogadores() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'principal'|'academy'>('principal')
  const [selLiga, setSelLiga] = useState('')
  const [selTime, setSelTime] = useState('')

  const teamsForLiga = selLiga ? (TEAMS_BY_LEAGUE[selLiga] ?? []) : []

  // When liga changes, reset time
  const handleLigaChange = (v: string) => { setSelLiga(v); setSelTime('') }

  const source = tab === 'principal' ? PLAYERS_PRINCIPAL_FULL : PLAYERS_ACADEMY_FULL

  const filtered = source.filter(p => {
    if (selLiga && p.liga !== selLiga) return false
    if (selTime && p.team !== selTime && p.team !== selTime + ' Academy') return false
    if (search && !p.nick.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <PanelHeader title="Jogadores" sub="Elenco principal e academy de todas as regiões." />

      {/* Tabs */}
      <div className="flex border-b border-white/[0.07] mb-4">
        {(['principal','academy'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setSelTime('') }}
            className="px-5 py-2 font-display font-bold text-xs uppercase tracking-widest cursor-pointer border-none bg-transparent transition-colors"
            style={{ color: tab===t ? '#fff' : 'rgba(255,255,255,0.4)', borderBottom: tab===t ? '2px solid #615fff' : '2px solid transparent', marginBottom: '-1px' }}>
            {t === 'principal' ? 'Principal' : 'Academy'}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px] rounded-lg px-3 py-2 text-xs"
          style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar jogador..." className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-white/25" />
        </div>

        {/* Liga dropdown */}
        <select value={selLiga} onChange={e=>handleLigaChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs text-white outline-none cursor-pointer flex-shrink-0"
          style={{ background:'rgba(15,15,30,0.95)',border:'1px solid rgba(255,255,255,0.12)',minWidth:90 }}>
          <option value="">Todas as Ligas</option>
          {ALL_LEAGUES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Time dropdown — only visible when liga selected */}
        <select value={selTime} onChange={e=>setSelTime(e.target.value)}
          disabled={!selLiga}
          className="px-3 py-2 rounded-lg text-xs text-white outline-none cursor-pointer flex-shrink-0"
          style={{ background:'rgba(15,15,30,0.95)',border:'1px solid rgba(255,255,255,0.12)',minWidth:160,opacity:selLiga?1:0.35 }}>
          <option value="">Todos os Times</option>
          {teamsForLiga.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Count badge */}
        <span className="text-[10px] text-white/30 flex-shrink-0">{filtered.length} jogadores</span>

        <button className="btn-primary text-[11px] ml-auto flex-shrink-0" style={{ padding:'8px 16px' }}>+ Novo Jogador</button>
      </div>

      {/* Table */}
      <table className="ed-table">
        <thead>
          <tr>
            <th>Jogador</th><th>Liga</th><th>Time</th><th>Pos.</th>
            <th>Pot.</th><th>Overall</th><th>Reputação</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 50).map((p, i) => (
            <tr key={p.nick + p.team + i}>
              <td>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: tab==='academy' ? 'rgba(0,200,100,0.2)' : 'rgba(97,95,255,0.2)', color: tab==='academy' ? '#00c864' : '#615fff' }}>
                    {p.nick[0].toUpperCase()}
                  </div>
                  {p.nick}
                </div>
              </td>
              <td>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{ background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.6)' }}>
                  {p.liga}
                </span>
              </td>
              <td className="text-white/60 text-[11px]">{p.team}</td>
              <td className="text-white/60 text-[11px]">{p.pos}</td>
              <td className="text-white/55 text-xs">{p.potential}</td>
              <td style={{ width:110 }}><RatingBar val={p.overall} /></td>
              <td style={{ width:110 }}><RatingBar val={p.rep} /></td>
              <td><ActionBtns /></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={8} className="text-center text-white/30 py-8 text-sm">
              Nenhum jogador encontrado para os filtros selecionados.
            </td></tr>
          )}
          {filtered.length > 50 && (
            <tr><td colSpan={8} className="text-center text-white/20 py-3 text-xs">
              Mostrando 50 de {filtered.length} — use os filtros para refinar
            </td></tr>
          )}
        </tbody>
      </table>
    </>
  )
}

// ── PANEL: MANAGERS ──────────────────────────────────────────────
const MANAGERS_DATA = [
  { name:'Reven', age:32, team:'LOUD', liga:'CBLOL', nac:'Brasil', draft:'Agressivo', perfil:'Explosivo', rep:88 },
  { name:'Guilhoto', age:35, team:'paiN Gaming', liga:'CBLOL', nac:'Brasil', draft:'Equilibrado', perfil:'Analítico', rep:82 },
  { name:'Zikzlol', age:30, team:'T1', liga:'LCK', nac:'Coreia do Sul', draft:'Equilibrado', perfil:'Estóico', rep:96 },
  { name:'Cvmax', age:38, team:'Gen.G', liga:'LCK', nac:'Coreia do Sul', draft:'Agressivo', perfil:'Motivador', rep:90 },
  { name:'Fabian', age:33, team:'G2 Esports', liga:'LEC', nac:'Alemanha', draft:'Agressivo', perfil:'Analítico', rep:88 },
  { name:'Yamato Cannon', age:42, team:'Fnatic', liga:'LEC', nac:'Suécia', draft:'Lento', perfil:'Estóico', rep:85 },
]

function PanelManagers() {
  const [search, setSearch] = useState('')
  const filtered = MANAGERS_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <PanelHeader title="Managers" sub="Head coaches e managers das equipes do circuito." />
      <TopBar search={search} onSearch={setSearch} addLabel="Novo Manager" />
      <table className="ed-table">
        <thead><tr><th>Manager</th><th>Idade</th><th>Time</th><th>Nac.</th><th>Draft</th><th>Perfil</th><th>Reputação</th><th>Ações</th></tr></thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.name}>
              <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700' }}>{m.name[0]}</div>{m.name}</div></td>
              <td className="text-white/50">{m.age}</td>
              <td className="text-white/60">{m.team}</td>
              <td className="text-white/50 text-[11px]">{m.nac}</td>
              <td><span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(97,95,255,0.12)', color: '#9b8fff', border: '1px solid rgba(97,95,255,0.25)' }}>{m.draft}</span></td>
              <td className="text-white/60">{m.perfil}</td>
              <td style={{ width: 120 }}><RatingBar val={m.rep} /></td>
              <td><ActionBtns /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// ── PANEL: IMPRENSA ───────────────────────────────────────────────
const IMPRENSA_DATA = [
  { name:'Ilha das Lendas', reach:'Nacional' }, { name:'ESPN Esports', reach:'Internacional' },
  { name:'Mais Esports', reach:'Nacional' }, { name:'Rift Herald', reach:'Global' }, { name:'BSTN', reach:'Regional' },
]
function PanelImprensa() {
  const [search, setSearch] = useState('')
  const filtered = IMPRENSA_DATA.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <PanelHeader title="Imprensa" sub="Veículos de imprensa e portais de notícias do ecossistema." />
      <TopBar search={search} onSearch={setSearch} addLabel="Novo Veículo" />
      <table className="ed-table">
        <thead><tr><th>Veículo</th><th>Alcance</th><th>Logo</th><th>Ações</th></tr></thead>
        <tbody>
          {filtered.map(i => (
            <tr key={i.name}>
              <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(100,150,255,0.2)', color: '#6496ff' }}>{i.name[0]}</div>{i.name}</div></td>
              <td className="text-white/50">{i.reach}</td>
              <td><button className="w-6 h-6 rounded text-xs cursor-pointer border-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>🖼</button></td>
              <td><ActionBtns /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// ── PANEL: INFLUENCERS ────────────────────────────────────────────
const INF_DATA = [
  { name:'BrTT', handle:'@brtt' }, { name:'Mylonlol', handle:'@mylonlol' },
  { name:'Baiano', handle:'@baianolol' }, { name:'Minervalol', handle:'@minervalol' },
  { name:'Revolta', handle:'@revolta' }, { name:'Tinowns', handle:'@tinowns' },
]
function PanelInfluencers() {
  const [search, setSearch] = useState('')
  const filtered = INF_DATA.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <PanelHeader title="Influencers" sub="Criadores de conteúdo e personalidades do cenário." />
      <TopBar search={search} onSearch={setSearch} addLabel="Novo Influencer" />
      <table className="ed-table">
        <thead><tr><th>Influencer</th><th>Handle</th><th>Foto</th><th>Ações</th></tr></thead>
        <tbody>
          {filtered.map(i => (
            <tr key={i.name}>
              <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(217,70,239,0.2)', color: '#d946ef' }}>{i.name[0]}</div>{i.name}</div></td>
              <td style={{ color: '#9b8fff', fontWeight: 500 }}>{i.handle}</td>
              <td><button className="w-6 h-6 rounded text-xs cursor-pointer border-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>🖼</button></td>
              <td><ActionBtns /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// ── PANEL: PATROCINADORES ─────────────────────────────────────────
const PAT_DATA = [
  { name:'Razer', seg:'Hardware', nivel:'Global' }, { name:'Itaú', seg:'Financeiro', nivel:'Nacional' },
  { name:'Heineken 0.0', seg:'Bebidas', nivel:'Internacional' }, { name:'ASUS ROG', seg:'Hardware', nivel:'Global' },
  { name:'Logitech G', seg:'Periféricos', nivel:'Global' }, { name:'Red Bull', seg:'Bebidas', nivel:'Global' },
  { name:'Intel', seg:'Tecnologia', nivel:'Global' }, { name:'Vivo', seg:'Telecom', nivel:'Nacional' },
]
const NIVEL_COLORS: Record<string, string> = { Global:'#ffd700', Internacional:'#9b8fff', Nacional:'#00c864', Regional:'#6496ff' }

function PanelPatrocinadores() {
  const [search, setSearch] = useState('')
  const filtered = PAT_DATA.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <PanelHeader title="Patrocinadores" sub="Marcas e empresas parceiras do ecossistema." />
      <TopBar search={search} onSearch={setSearch} addLabel="Novo Patrocinador" />
      <table className="ed-table">
        <thead><tr><th>Marca</th><th>Segmento</th><th>Nível</th><th>Logo</th><th>Ações</th></tr></thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.name}>
              <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700' }}>{p.name[0]}</div>{p.name}</div></td>
              <td className="text-white/50">{p.seg}</td>
              <td style={{ color: NIVEL_COLORS[p.nivel] ?? '#aaa', fontWeight: 600, fontSize: 11 }}>{p.nivel}</td>
              <td><button className="w-6 h-6 rounded text-xs cursor-pointer border-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>🖼</button></td>
              <td><ActionBtns /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// ── PANEL: CAMPEÕES ───────────────────────────────────────────────
const TIER_COLORS: Record<string, string> = { 'S+':'#ff4500', S:'#ffd700', A:'#00c864', B:'#6496ff', C:'#888' }
const PATCH_STYLES: Record<string, { bg: string; color: string }> = {
  BUFFED: { bg: 'rgba(0,200,100,0.12)', color: '#00c864' },
  NORMAL: { bg: 'rgba(200,200,200,0.08)', color: '#aaa' },
  NERFED: { bg: 'rgba(255,80,80,0.12)', color: '#ff5050' },
}
const CHAMPS_DATA = [
  { name:'Ahri', route:'Mid', rating:65, tier:'B', patch:'NORMAL' },
  { name:'Akali', route:'Mid / Top', rating:83, tier:'A', patch:'NORMAL' },
  { name:'Caitlyn', route:'Bot (ADC)', rating:80, tier:'B', patch:'NERFED' },
  { name:'Jinx', route:'Bot (ADC)', rating:90, tier:'S', patch:'BUFFED' },
  { name:'Lee Sin', route:'Jungle', rating:79, tier:'B', patch:'NORMAL' },
  { name:'Orianna', route:'Mid', rating:91, tier:'S', patch:'NORMAL' },
  { name:'Thresh', route:'Suporte', rating:86, tier:'A', patch:'NORMAL' },
  { name:'Viktor', route:'Mid', rating:93, tier:'S+', patch:'BUFFED' },
  { name:'Zeri', route:'Bot (ADC)', rating:94, tier:'S+', patch:'BUFFED' },
  { name:'Zed', route:'Mid / Jungle', rating:75, tier:'B', patch:'NERFED' },
]

function PanelCampeoes() {
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('')
  const filtered = CHAMPS_DATA.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterTier === '' || c.tier === filterTier)
  )
  return (
    <>
      <PanelHeader title="Campeões e Meta" sub="Gerencie o pool de campeões e o estado do meta atual." />
      <TopBar search={search} onSearch={setSearch} addLabel="Novo Campeão">
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="px-3 py-2 rounded-lg text-xs text-white outline-none cursor-pointer"
          style={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <option value="">Todos os Tiers</option>
          {['S+','S','A','B','C'].map(t => <option key={t}>{t}</option>)}
        </select>
      </TopBar>
      <table className="ed-table">
        <thead><tr><th>Campeão</th><th>Rota</th><th>Rating</th><th>Tier</th><th>Patch</th><th>Imagem</th><th>Ações</th></tr></thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.name}>
              <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(97,95,255,0.2)', color: '#615fff' }}>{c.name[0]}</div>{c.name}</div></td>
              <td className="text-white/40 text-[11px]">{c.route}</td>
              <td style={{ width: 120 }}><RatingBar val={c.rating} /></td>
              <td><span className="font-bold text-sm" style={{ color: TIER_COLORS[c.tier] }}>{c.tier}</span></td>
              <td><span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: PATCH_STYLES[c.patch].bg, color: PATCH_STYLES[c.patch].color, border: `1px solid ${PATCH_STYLES[c.patch].color}44` }}>{c.patch}</span></td>
              <td><button className="w-6 h-6 rounded text-xs cursor-pointer border-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>🖼</button></td>
              <td><ActionBtns /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
