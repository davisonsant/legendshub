import { useState, useRef } from 'react'
import { useAppStore } from '@/store'
import { Icons } from '@/lib/icons'

// ── Types ──────────────────────────────────────────────────────────
interface CareerSetup {
  db: string
  managerName: string
  managerAge: number
  nationality: string
  currency: string
  language: string
  photoUrl: string
  teamId: string
  teamName: string
  teamLeague: string
}

// ── Data ───────────────────────────────────────────────────────────
const DB_OPTIONS = [
  { id:'default',   name:'DEFAULT.DB',  size:'2.8 MB', tag:'RECOMENDADO', desc:'Base padrão oficial com dados de fábrica de times, jogadores e campeonatos oficiais.', format:'OFICIAL LOCAL', local:true },
  { id:'season25',  name:'SEASON25.DB', size:'4.1 MB', tag:'',            desc:'Base com todas as atualizações da temporada 2025.',                                      format:'TEMPORADA MOD', local:true },
  { id:'season26',  name:'SEASON26',    size:'4.5 MB', tag:'',            desc:'Base com todas as atualizações da temporada 2026.',                                      format:'TEMPORADA MOD', local:true },
  { id:'legendsdb', name:'LEGENDSDB',   size:'4.9 MB', tag:'',            desc:'Base com todos os jogadores e times lendários do competitivo de League of Legends.',    format:'LENDÁRIO MOD', local:true },
]
const DB_ONLINE = [
  { id:'cblol_superstars', name:'CBLOL_Superstars.db', size:'4.7 MB', tag:'SUPERSTARS MOD', desc:'Base especial de elenco dos astros e rivalidades do cenário brasileiro do CBLOL.' },
  { id:'lck_legends',      name:'LCK_Legends.db',      size:'4.3 MB', tag:'LCK MOD',        desc:'Base dos times lendários e históricos da liga coreana LCK.' },
]

const NATIONALITIES = ['Brasil','Estados Unidos','Coreia do Sul','China','Alemanha','França','Espanha','Japão','Portugal','Argentina','México','Itália','Reino Unido','Austrália','Canadá']
const CURRENCIES    = ['USD ($)','BRL (R$)','EUR (€)','KRW (₩)','CNY (¥)','GBP (£)','JPY (¥)']
const LANGUAGES     = ['PT-BR (Português)','EN (English)','ES (Español)','FR (Français)','DE (Deutsch)','JA (日本語)','RU (Русский)']

const TEAMS_BY_LEAGUE: Record<string, {id:string;name:string;sigla:string;color:string;emoji:string;desc:string;budget:string;fanbase:string;prestige:number;tier:string}[]> = {
  'BRASIL (CBLOL)': [
    { id:'loud',      name:'LOUD',          sigla:'LLL', color:'#00ff87', emoji:'⚡', desc:'O orgulho verde e amarelo. Maior fanbase do Brasil, campeã múltiplas vezes do CBLOL com jogadores icônicos.',        budget:'$ 1.8M', fanbase:'95% Ativa', prestige:5, tier:'TIER S' },
    { id:'pain',      name:'paiN Gaming',   sigla:'PNG', color:'#ff6600', emoji:'🔥', desc:'Organização veterana do Brasil com longa história no cenário competitivo e forte representação internacional.',       budget:'$ 1.6M', fanbase:'88% Ativa', prestige:4, tier:'TIER S' },
    { id:'furia',     name:'FURIA',         sigla:'FUR', color:'#ffffff', emoji:'🐆', desc:'A pantera do Brasil. Agressiva, audaciosa e com uma das torcidas mais apaixonadas do cenário nacional.',             budget:'$ 1.4M', fanbase:'82% Ativa', prestige:4, tier:'TIER S' },
    { id:'red',       name:'RED Canids',    sigla:'RED', color:'#ff3333', emoji:'🐕', desc:'Os Canids vermelhos com espírito competitivo feroz. Séria ameaça a qualquer equipe do CBLOL.',                       budget:'$ 1.2M', fanbase:'75% Ativa', prestige:3, tier:'TIER S' },
    { id:'keyd',      name:'Vivo Keyd',     sigla:'VKS', color:'#ffd700', emoji:'⭐', desc:'Organização histórica com parceria Vivo. Berço de talentos e rivalidades épicas no Brasil.',                         budget:'$ 1.1M', fanbase:'70% Ativa', prestige:3, tier:'TIER S' },
    { id:'fluxo',     name:'Fluxo W7M',     sigla:'FXS', color:'#00ccff', emoji:'🌊', desc:'Esquadrão audacioso no Brasil, liderado por ídolos de eSports com engajamento explosivo e imensa torcida apaixonada.',budget:'$ 1.4M', fanbase:'78% Ativa', prestige:4, tier:'TIER S' },
    { id:'leviatan',  name:'LEVIATÁN',      sigla:'LEV', color:'#9933ff', emoji:'🐉', desc:'O Leviatã da América do Sul. Estilo de jogo imprevisível com jogadores talentosos.',                                 budget:'$ 1.0M', fanbase:'65% Ativa', prestige:3, tier:'TIER A' },
    { id:'los',       name:'LOS',           sigla:'LOS', color:'#888888', emoji:'🎯', desc:'Time em ascensão no CBLOL buscando seu espaço entre os grandes da liga.',                                             budget:'$ 0.9M', fanbase:'55% Ativa', prestige:2, tier:'TIER A' },
  ],
  'AMÉRICA DO NORTE (LCS)': [
    { id:'c9',        name:'Cloud9',            sigla:'C9',  color:'#3399ff', emoji:'☁', desc:'O orgulho norte-americano em campeonatos mundiais, famosa pelo ambiente leve, memes e rosters superestrelas.',     budget:'$ 2.8M', fanbase:'91% Ativa', prestige:5, tier:'TIER S' },
    { id:'tl',        name:'Team Liquid',        sigla:'TL',  color:'#00aaff', emoji:'💧', desc:'Organização profissional de elite. Infraestrutura de ponta e histórico de contratações de jogadores mundiais.',  budget:'$ 3.0M', fanbase:'85% Ativa', prestige:5, tier:'TIER S' },
    { id:'lyon',      name:'LYON',               sigla:'LYN', color:'#ff9900', emoji:'🦁', desc:'O novo poder da LCS com Berserker e Inspired. Agressivos e talentosos com fome de títulos.',                    budget:'$ 2.5M', fanbase:'80% Ativa', prestige:4, tier:'TIER S' },
    { id:'fly',       name:'FlyQuest',           sigla:'FLY', color:'#00ff99', emoji:'🦋', desc:'Time ecológico com coração. FlyQuest surpreende a cada split com jogadas criativas.',                           budget:'$ 2.0M', fanbase:'72% Ativa', prestige:3, tier:'TIER A' },
    { id:'dig',       name:'Dignitas',           sigla:'DIG', color:'#ff0066', emoji:'💎', desc:'Veteranos da LCS com renovada ambição. Dignitas busca reconquistar o topo da liga.',                            budget:'$ 1.8M', fanbase:'65% Ativa', prestige:3, tier:'TIER A' },
    { id:'sen',       name:'Sentinels',          sigla:'SEN', color:'#ff3300', emoji:'🛡', desc:'Gigante do eSports que entrou na LCS com grande força financeira e elenco estrelado.',                          budget:'$ 2.2M', fanbase:'78% Ativa', prestige:4, tier:'TIER S' },
    { id:'sho',       name:'Shopify Rebellion',  sigla:'SR',  color:'#96bf48', emoji:'🛒', desc:'A rebelião verde. Time de surpresas da LCS com foco em talentos emergentes.',                                   budget:'$ 1.5M', fanbase:'60% Ativa', prestige:2, tier:'TIER A' },
    { id:'dis',       name:'Disguised',          sigla:'DSG', color:'#8844ee', emoji:'🎭', desc:'A organização de Ludwig. Mistura de entretenimento e competição séria na LCS.',                                  budget:'$ 1.6M', fanbase:'68% Ativa', prestige:3, tier:'TIER A' },
  ],
  'EUROPA (LEC)': [
    { id:'g2',        name:'G2 Esports',    sigla:'G2',  color:'#ffcc00', emoji:'⚔', desc:'Os samurais brincalhões da Europa, soberanos do entretenimento estratégico com flex-picks incríveis.',                budget:'$ 3.2M', fanbase:'97% Ativa', prestige:5, tier:'TIER S' },
    { id:'fnc',       name:'Fnatic',        sigla:'FNC', color:'#ff6600', emoji:'🐍', desc:'A cobra laranja. Lendária organização europeia com décadas de história e fãs fanáticos ao redor do mundo.',         budget:'$ 2.8M', fanbase:'94% Ativa', prestige:5, tier:'TIER S' },
    { id:'koi',       name:'Movistar KOI',  sigla:'KOI', color:'#ff9900', emoji:'🐟', desc:'A carpa colorida da Espanha. Time vibrante com Elyoya no jungle e Jojopyun no mid.',                                budget:'$ 2.2M', fanbase:'80% Ativa', prestige:4, tier:'TIER S' },
    { id:'kc',        name:'Karmine Corp',  sigla:'KC',  color:'#3300ff', emoji:'💙', desc:'A potência azul da França. Comunidade fervorosa e estilo agressivo e empolgante.',                                  budget:'$ 2.0M', fanbase:'88% Ativa', prestige:4, tier:'TIER S' },
    { id:'vit',       name:'Team Vitality', sigla:'VIT', color:'#ffdd00', emoji:'🐝', desc:'A abelha da LEC. Time de alto orçamento com foco em jogo de equipe coordenado.',                                    budget:'$ 2.5M', fanbase:'75% Ativa', prestige:4, tier:'TIER S' },
    { id:'sk',        name:'SK Gaming',     sigla:'SK',  color:'#ff6600', emoji:'🎮', desc:'Veteranos históricos com legado imenso. Wunder e Mikyx lideram o renascimento do SK.',                               budget:'$ 2.0M', fanbase:'72% Ativa', prestige:4, tier:'TIER S' },
    { id:'gx',        name:'GIANTX',        sigla:'GX',  color:'#00aaff', emoji:'🦕', desc:'O gigante espanhol ascendendo. Time jovem com imenso potencial e apoio enorme da Espanha.',                         budget:'$ 1.8M', fanbase:'70% Ativa', prestige:3, tier:'TIER A' },
    { id:'th',        name:'Team Heretics', sigla:'TH',  color:'#9900ff', emoji:'🔮', desc:'Hereges da cena europeia com estilo único e comunidade crescente de fãs.',                                          budget:'$ 1.6M', fanbase:'65% Ativa', prestige:3, tier:'TIER A' },
    { id:'navi',      name:'Natus Vincere', sigla:'NAV', color:'#f5a623', emoji:'🏆', desc:'Born to win. Lenda do eSports global chega ao LoL com toda sua glória e estrutura.',                                budget:'$ 2.2M', fanbase:'82% Ativa', prestige:4, tier:'TIER S' },
    { id:'shf',       name:'Shifters',      sigla:'SHF', color:'#888888', emoji:'🔄', desc:'O time mais imprevisível da LEC. Mudanças táticas constantes surpreendem adversários.',                              budget:'$ 1.4M', fanbase:'58% Ativa', prestige:2, tier:'TIER A' },
  ],
  'COREIA (LCK)': [
    { id:'t1',        name:'T1',                    sigla:'T1',  color:'#cc0000', emoji:'🔴', desc:'A maior organização da história do esporte eletrônico mundial, casa de reis coroados de Summoner\'s Rift e recorde absoluto de audiência.', budget:'$ 3.5M', fanbase:'99% Ativa', prestige:5, tier:'TIER S' },
    { id:'gen',       name:'Gen.G',                 sigla:'GEN', color:'#c8a800', emoji:'👑', desc:'Os cavaleiros dourados. Roster de elite com Chovy, Canyon e Ruler. Um dos times mais fortes do mundo.',    budget:'$ 3.2M', fanbase:'92% Ativa', prestige:5, tier:'TIER S' },
    { id:'kt',        name:'KT Rolster',            sigla:'KT',  color:'#cc0000', emoji:'⚡', desc:'O eterno rival do T1. KT tem uma das torcidas mais apaixonadas da Coreia e história rica.',                 budget:'$ 2.8M', fanbase:'88% Ativa', prestige:5, tier:'TIER S' },
    { id:'hle',       name:'Hanwha Life Esports',   sigla:'HLE', color:'#00cc66', emoji:'💚', desc:'Os guerreiros verdes com Zeus e Kanavi. Estrutura impressionante e nível de exigência alto.',              budget:'$ 2.8M', fanbase:'84% Ativa', prestige:4, tier:'TIER S' },
    { id:'dk',        name:'Dplus KIA',             sigla:'DK',  color:'#1155cc', emoji:'🔵', desc:'ShowMaker no mid lidera o time azul coreano. Estilo analítico e mecânico preciso.',                        budget:'$ 2.6M', fanbase:'80% Ativa', prestige:4, tier:'TIER S' },
    { id:'ns',        name:'NS RedForce',           sigla:'NS',  color:'#cc3300', emoji:'🎯', desc:'Scout e Kingen brilham no RedForce. Time sólido com foco em macro-game refinado.',                         budget:'$ 2.0M', fanbase:'70% Ativa', prestige:3, tier:'TIER S' },
    { id:'dns',       name:'DN SOOPers',            sigla:'DNS', color:'#00aaff', emoji:'🐠', desc:'O time surpresa da LCK. DuDu e Pyosik constroem jogadas explosivas temporada a temporada.',                budget:'$ 1.8M', fanbase:'65% Ativa', prestige:3, tier:'TIER A' },
    { id:'drx',       name:'DRX',                   sigla:'DRX', color:'#9933cc', emoji:'🐉', desc:'Campeões mundiais 2022. DRX tem DNA de superação e reviravoltas inesquecíveis.',                          budget:'$ 2.2M', fanbase:'78% Ativa', prestige:4, tier:'TIER S' },
    { id:'frx',       name:'FEARX',                 sigla:'FRX', color:'#cc6600', emoji:'🦊', desc:'O time da raposa. FEARX compete com garra e determinação a cada split da LCK.',                            budget:'$ 1.6M', fanbase:'58% Ativa', prestige:2, tier:'TIER A' },
    { id:'bro',       name:'OKSavingsBank BRION',   sigla:'BRO', color:'#ffaa00', emoji:'🏦', desc:'Bank on them! Brion é o time de menor orçamento mas com muita vontade de vencer.',                         budget:'$ 1.4M', fanbase:'55% Ativa', prestige:2, tier:'TIER A' },
  ],
  'CHINA (LPL)': [
    { id:'blg',       name:'Bilibili Gaming',  sigla:'BLG', color:'#00aaff', emoji:'🎮', desc:'Bin e Knight formam a dupla mais temida da China. BLG domina a LPL com estilo agressivo e mecânica impecável.',  budget:'$ 3.2M', fanbase:'88% Ativa', prestige:5, tier:'TIER S' },
    { id:'tes',       name:'Top Esports',      sigla:'TES', color:'#ff6600', emoji:'🔝', desc:'JackeyLove e 369 lideram o TES. Powerhouse da LPL com fans fanáticos e nível técnico altíssimo.',               budget:'$ 3.0M', fanbase:'85% Ativa', prestige:5, tier:'TIER S' },
    { id:'al',        name:"Anyone's Legend",  sigla:'AL',  color:'#ff0099', emoji:'🌸', desc:'Força indômita do cenário chinês, famosa por sua ousadia e velocidade letal em lutas iniciais.',                budget:'$ 1.6M', fanbase:'70% Ativa', prestige:3, tier:'TIER S' },
    { id:'jdg',       name:'JD Gaming',        sigla:'JDG', color:'#cc0000', emoji:'🎰', desc:'Campeões mundiais 2023. JDG tem o melhor histórico recente da China em Worlds.',                                budget:'$ 3.0M', fanbase:'87% Ativa', prestige:5, tier:'TIER S' },
    { id:'wbg',       name:'Weibo Gaming',     sigla:'WBG', color:'#ff4400', emoji:'🔴', desc:'Jiejie e Xiaohu constroem um estilo único. Weibo Gaming surpreende com rotações perfeitas.',                   budget:'$ 2.5M', fanbase:'78% Ativa', prestige:4, tier:'TIER S' },
    { id:'edg',       name:'EDward Gaming',    sigla:'EDG', color:'#0088ff', emoji:'💙', desc:'Campeões mundiais 2021. EDG tem legado único e fãs leais em todo o mundo.',                                    budget:'$ 2.5M', fanbase:'80% Ativa', prestige:5, tier:'TIER S' },
    { id:'ig',        name:'Invictus Gaming',  sigla:'IG',  color:'#cc6600', emoji:'🔥', desc:'Campeões mundiais 2018 com Rookie no mid. IG tem o legado mais épico da história.',                            budget:'$ 2.2M', fanbase:'75% Ativa', prestige:4, tier:'TIER S' },
    { id:'lgd',       name:'LGD Gaming',       sigla:'LGD', color:'#9900ff', emoji:'🟣', desc:'Um dos times mais tradicionais da China. LGD aposta em novos talentos e consistência.',                        budget:'$ 1.8M', fanbase:'65% Ativa', prestige:3, tier:'TIER A' },
    { id:'lng',       name:'LNG Esports',      sigla:'LNG', color:'#00ccff', emoji:'🌊', desc:'Croco no jungle comanda o LNG. Time de rotações rápidas e picks criativos.',                                   budget:'$ 2.0M', fanbase:'68% Ativa', prestige:3, tier:'TIER A' },
    { id:'omg',       name:'Oh My God',        sigla:'OMG', color:'#ff00ff', emoji:'😮', desc:'OMG é o curinga da LPL. Imprevisível, agressivo e sempre capaz de eliminar gigantes.',                         budget:'$ 1.6M', fanbase:'62% Ativa', prestige:3, tier:'TIER A' },
    { id:'tt',        name:'TT Gaming',        sigla:'TT',  color:'#888888', emoji:'⚡', desc:'ThunderTalk Gaming em reconstrução. Aposta em talentos jovens para o futuro.',                                  budget:'$ 1.4M', fanbase:'55% Ativa', prestige:2, tier:'TIER B' },
    { id:'up',        name:'Ultra Prime',      sigla:'UP',  color:'#cc00ff', emoji:'💜', desc:'Ultra Prime busca consistência na LPL com elenco misto e estilo ofensivo.',                                    budget:'$ 1.5M', fanbase:'58% Ativa', prestige:2, tier:'TIER B' },
    { id:'nip',       name:'Ninjas in Pyjamas',sigla:'NIP', color:'#00ff88', emoji:'🥷', desc:'NIP traz a marca global ao LoL chinês. Organização séria com visão internacional.',                            budget:'$ 1.8M', fanbase:'65% Ativa', prestige:3, tier:'TIER A' },
    { id:'we',        name:'Team WE',          sigla:'WE',  color:'#ff9900', emoji:'🐼', desc:'Uma das organizações mais antigas da China. WE carrega história e tradição na LPL.',                           budget:'$ 1.6M', fanbase:'60% Ativa', prestige:3, tier:'TIER A' },
  ],
  'PACÍFICO (LCP)': [
    { id:'ctbc',      name:'CTBC Flying Oyster',  sigla:'CFO', color:'#00ffaa', emoji:'🦪', desc:'Os Flying Oysters de Taiwan. Time criativo com Doggo no ADC e forte presença regional.',                     budget:'$ 1.4M', fanbase:'78% Ativa', prestige:4, tier:'TIER S' },
    { id:'gam',       name:'GAM Esports',         sigla:'GAM', color:'#ffdd00', emoji:'🇻🇳', desc:'O poder do Vietnã no LCP. GAM Esports é rápido, agressivo e representante orgulhoso.',                    budget:'$ 1.2M', fanbase:'82% Ativa', prestige:4, tier:'TIER S' },
    { id:'fsb',       name:'SoftBank Hawks',      sigla:'SBH', color:'#ff6600', emoji:'🦅', desc:'Evi lidera os Hawks do Japão. Estrutura sólida com apoio de uma das maiores empresas japonesas.',            budget:'$ 1.5M', fanbase:'75% Ativa', prestige:4, tier:'TIER S' },
    { id:'mvk',       name:'MVK Esports',         sigla:'MVK', color:'#ff4400', emoji:'🔶', desc:'Representantes do Vietnã com mentalidade de pilhagem rápida em Summoners Rift.',                             budget:'$ 1.3M', fanbase:'65% Ativa', prestige:3, tier:'TIER S' },
    { id:'sw',        name:'Team Secret Whales',  sigla:'TSW', color:'#0088ff', emoji:'🐋', desc:'As baleias misteriosas do Pacífico. Estratégia profunda e pool de picks únicos.',                           budget:'$ 1.2M', fanbase:'60% Ativa', prestige:3, tier:'TIER A' },
    { id:'dcg',       name:'Deep Cross Gaming',   sigla:'DCG', color:'#00aaff', emoji:'🌊', desc:'DCG cruza o abismo competitivo com jogadas inovadoras e coragem.',                                          budget:'$ 1.0M', fanbase:'55% Ativa', prestige:2, tier:'TIER A' },
    { id:'gzg',       name:'Ground Zero Gaming',  sigla:'GZG', color:'#888888', emoji:'💣', desc:'Começando do zero. GZG é ambicioso e determinado a provar seu valor no LCP.',                               budget:'$ 0.9M', fanbase:'50% Ativa', prestige:2, tier:'TIER A' },
    { id:'dfm',       name:'DetonatioN FM',       sigla:'DFM', color:'#ff0000', emoji:'💥', desc:'Veteranos do Japão com maior história regional. DFM representa o pais em Worlds constantemente.',          budget:'$ 1.4M', fanbase:'72% Ativa', prestige:4, tier:'TIER S' },
  ],
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/9.x/personas/svg?seed=manager1&backgroundColor=1e2a3a',
  'https://api.dicebear.com/9.x/personas/svg?seed=manager2&backgroundColor=1e2a3a',
  'https://api.dicebear.com/9.x/personas/svg?seed=manager3&backgroundColor=1e2a3a',
  'https://api.dicebear.com/9.x/personas/svg?seed=manager4&backgroundColor=1e2a3a',
  'https://api.dicebear.com/9.x/personas/svg?seed=manager5&backgroundColor=1e2a3a',
]

const LEAGUES = Object.keys(TEAMS_BY_LEAGUE)

// ── Stepper ─────────────────────────────────────────────────────────
const STEPS = ['Banco de Dados','Perfil do Manager','Selecione Equipe','Conferir & Iniciar']

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 py-5 px-8 flex-shrink-0">
      {STEPS.map((label, i) => {
        const done    = i < current
        const active  = i === current
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2"
                style={{
                  background: done ? '#00e5a0' : active ? 'rgba(0,229,160,0.15)' : 'rgba(255,255,255,0.05)',
                  borderColor: done || active ? '#00e5a0' : 'rgba(255,255,255,0.15)',
                  color: done ? '#0a0e1a' : active ? '#00e5a0' : 'rgba(255,255,255,0.3)',
                }}
              >
                {done ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : i === 3 ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg> : i + 1}
              </div>
              <span className="text-[9px] uppercase tracking-widest font-bold whitespace-nowrap"
                style={{ color: done || active ? '#00e5a0' : 'rgba(255,255,255,0.25)' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-16 h-px mx-2 mb-4" style={{ background: done ? '#00e5a0' : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────
export default function ModalNewCareer() {
  const { closeModal, openModal } = useAppStore()
  const [view, setView] = useState<'choose'|'wizard'>('choose')
  const [step, setStep] = useState(0)
  const [setup, setSetup] = useState<CareerSetup>({
    db: 'default', managerName: '', managerAge: 30,
    nationality: 'Brasil', currency: 'USD ($)', language: 'PT-BR (Português)',
    photoUrl: PRESET_AVATARS[0], teamId: '', teamName: '', teamLeague: '',
  })

  if (view === 'choose') {
    return (
      <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
        <div className="modal-card p-8" style={{ maxWidth:'700px' }}>
          <button onClick={closeModal} className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center border-none cursor-pointer" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.14)';(e.currentTarget as HTMLElement).style.color='#fff'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)'}}>
            {Icons.x(14)}
          </button>
          <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full" style={{background:'#615fff'}}/><span className="text-[10px] font-bold uppercase tracking-[3px] text-white/30">Antes de começar</span></div>
          <h2 className="font-display font-bold text-3xl text-white mb-3">Como você quer jogar LegendsHub?</h2>
          <p className="text-sm text-white/45 leading-relaxed mb-6">Com uma conta, seus saves ficam sincronizados na nuvem, você participa do chat global por país, publica saves na comunidade e ganha badges. Sem conta, dá pra jogar tudo offline mesmo — só perde o lado social.</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <button onClick={() => { closeModal(); openModal('auth-login') }}
              className="relative flex flex-col p-5 rounded-xl cursor-pointer border-none text-left transition-all"
              style={{ background:'rgba(255,255,255,0.03)', border:'1.5px solid rgba(255,255,255,0.09)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)' }}>{Icons.login(18)}</div>
              <div className="text-[10px] font-bold uppercase tracking-[2.5px] text-white mb-1.5">Entrar</div>
              <div className="text-xs text-white/45 leading-relaxed">Já tenho uma conta LegendsHub.</div>
            </button>
            <button onClick={() => { closeModal(); openModal('auth-signup') }}
              className="relative flex flex-col p-5 rounded-xl cursor-pointer border-none text-left transition-all"
              style={{ background:'rgba(255,255,255,0.03)', border:'1.5px solid rgba(255,255,255,0.09)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)' }}>{Icons.userPlus(18)}</div>
              <div className="text-[10px] font-bold uppercase tracking-[2.5px] text-white mb-1.5">Criar Conta</div>
              <div className="text-xs text-white/45 leading-relaxed">Saves na nuvem, chat global, comunidade e badges.</div>
            </button>
            <button onClick={() => setView('wizard')}
              className="relative flex flex-col p-5 rounded-xl cursor-pointer border-none text-left transition-all"
              style={{ background:'linear-gradient(160deg,rgba(140,40,50,0.55) 0%,rgba(97,95,255,0.12) 100%)', border:'1.5px solid #615fff' }}>
              <span className="absolute -top-px left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-b-md" style={{ background:'#c0383a', color:'#fff' }}>Recomendado</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5" style={{ background:'rgba(200,60,70,0.25)', border:'1px solid rgba(200,60,70,0.3)', color:'#ff8080' }}>{Icons.saves(18)}</div>
              <div className="text-[10px] font-bold uppercase tracking-[2.5px] text-white mb-1.5">Jogar Offline</div>
              <div className="text-xs text-white/70 leading-relaxed">Continuo como visitante (só neste navegador).</div>
            </button>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background:'rgba(97,95,255,0.2)', border:'1px solid rgba(97,95,255,0.3)', color:'#a09dff' }}>O</span>
            <p className="text-[11px] text-white/35 leading-relaxed">Jogando offline, seus saves ficam apenas neste dispositivo e podem ser apagados se você limpar o cache do navegador. Você pode criar uma conta depois sem perder o progresso.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background:'#0a0e1a' }}>
      {/* Stepper bar */}
      <div className="flex-shrink-0 border-b border-white/[0.06]" style={{ background:'rgba(10,14,26,0.98)' }}>
        <Stepper current={step} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center py-8 px-4" style={{ scrollbarWidth:'none' }}>
        <div className="w-full max-w-[680px]">
          {step === 0 && <Step1DB setup={setup} setSetup={setSetup} onNext={() => setStep(1)} onBack={closeModal} />}
          {step === 1 && <Step2Manager setup={setup} setSetup={setSetup} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <Step3Team setup={setup} setSetup={setSetup} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step4Confirm setup={setup} onStart={closeModal} onBack={() => setStep(2)} />}
        </div>
      </div>
    </div>
  )
}

// ── STEP 1 — Banco de Dados ─────────────────────────────────────────
function Step1DB({ setup, setSetup, onNext, onBack }: any) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[3px] mb-2" style={{ color:'#00e5a0' }}>Estágio 1 · Esse é o seu banco de dados</p>
        <h2 className="font-display font-bold text-2xl uppercase text-white mb-2">Escolha do Banco de Dados</h2>
        <p className="text-sm text-white/45 leading-relaxed">Defina o universo procedural de jogo. Os diretórios local e online escaneiam as bases disponíveis para carregar jogadores, ligas e orçamentos competitivos.</p>
      </div>

      {/* Directory scan cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label:'Diretório Root Escaneado (Local)',  path:'[LegendsHub_Root]/db/', tag:'Diretório Local',  desc:'Verifica localmente na pasta db se existe um banco .db e lista como DEFAULT.DB', color:'#00e5a0', online:false },
          { label:'Diretório Root Escaneado (Online)', path:'https://github.com/davisonsant/Legendshub/tree/main/db', tag:'Online', desc:'Verifica de forma online no link acima se existe um banco .db e lista como atualização online.', color:'#00e5a0', online:true },
        ].map((d, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color:'#00e5a0' }}>{d.label}</div>
            <div className="text-xs font-mono mb-2" style={{ color:'#00e5a0' }}>{d.path}</div>
            <div className="text-[11px] text-white/35 mb-3 leading-relaxed">{d.desc}</div>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ background:'rgba(0,229,160,0.1)', color:'#00e5a0', border:'1px solid rgba(0,229,160,0.25)' }}>{d.tag}</span>
          </div>
        ))}
      </div>

      {/* Online DBs */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Disponível no Github (Download do Repositório)</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {DB_ONLINE.map(db => (
            <div key={db.id} className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-white">{db.name}</span>
                <span className="text-[9px] text-white/40 ml-2">{db.size}</span>
              </div>
              <div className="text-[11px] text-white/40 mb-3 leading-relaxed">{db.desc}</div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ background:'rgba(0,229,160,0.1)', color:'#00e5a0', border:'1px solid rgba(0,229,160,0.2)' }}>{db.tag}</span>
                <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded cursor-pointer border-none" style={{ background:'rgba(0,229,160,0.15)', color:'#00e5a0', border:'1px solid rgba(0,229,160,0.3)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Baixar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local DBs */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {DB_OPTIONS.map(db => (
          <button key={db.id} onClick={() => setSetup((s: CareerSetup) => ({ ...s, db: db.id }))}
            className="p-4 rounded-xl cursor-pointer border-none text-left transition-all"
            style={{
              background: setup.db===db.id ? 'rgba(0,229,160,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${setup.db===db.id ? '#00e5a0' : 'rgba(255,255,255,0.08)'}`,
            }}>
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={setup.db===db.id?'#00e5a0':'rgba(255,255,255,0.35)'} strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
                <span className="text-sm font-bold" style={{ color: setup.db===db.id ? '#00e5a0' : '#fff' }}>{db.name}</span>
              </div>
              <span className="text-[9px] text-white/35">{db.size}</span>
            </div>
            {db.tag && <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded mb-2 inline-block" style={{ background:'rgba(0,229,160,0.15)', color:'#00e5a0', border:'1px solid rgba(0,229,160,0.3)' }}>{db.tag}</span>}
            <div className="text-[11px] text-white/40 leading-relaxed mb-2">{db.desc}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color:'rgba(0,229,160,0.6)' }}>Formato: {db.format}</div>
          </button>
        ))}
      </div>

      {/* Custom DB */}
      <div className="flex items-center justify-between p-4 rounded-xl mb-6" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="text-sm font-bold text-white mb-0.5">Mod da Comunidade ou Database Custom</div>
          <div className="text-[11px] text-white/35">Caso possua um save customizado exportado (.db), faça o upload para integrá-lo dinamicamente.</div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer border-none whitespace-nowrap ml-4" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Carregar Arquivo de Banco (.DB)
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent">Voltar ao Menu</button>
        <button onClick={onNext} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer border-none" style={{ background:'#00e5a0', color:'#0a0e1a' }}>
          Avançar para Perfil →
        </button>
      </div>
    </div>
  )
}

// ── STEP 2 — Manager Profile ────────────────────────────────────────
function Step2Manager({ setup, setSetup, onNext, onBack }: any) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setSetup((s: CareerSetup) => ({ ...s, photoUrl: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[3px] mb-2" style={{ color:'#00e5a0' }}>Estágio 2 · Perfil do Treinador</p>
        <h2 className="font-display font-bold text-2xl uppercase text-white mb-2">Crie seu Manager</h2>
        <p className="text-sm text-white/45 leading-relaxed">Você assume o comando de uma organização. Comece definindo seu nome e idade — eles vão aparecer na sua bio, contratos e nos boletins da imprensa.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left: photo */}
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-3">Foto de Perfil</div>
          <div className="w-36 h-36 rounded-xl overflow-hidden mb-3 border border-white/10" style={{ background:'rgba(255,255,255,0.05)' }}>
            {setup.photoUrl
              ? <img src={setup.photoUrl} alt="Manager" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-white/20">{Icons.user(40)}</div>
            }
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer border-none mb-4"
            style={{ background:'rgba(0,229,160,0.12)', border:'1px solid rgba(0,229,160,0.3)', color:'#00e5a0' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Carregar imagem do computador
          </button>
          <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handlePhoto} />
          <div className="text-[9px] uppercase tracking-widest text-white/25 mb-2">Escolha um preset</div>
          <div className="flex gap-2">
            {PRESET_AVATARS.map((url, i) => (
              <button key={i} onClick={() => setSetup((s: CareerSetup) => ({ ...s, photoUrl: url }))}
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-none transition-all"
                style={{ border: setup.photoUrl===url ? '2px solid #00e5a0' : '2px solid rgba(255,255,255,0.1)' }}>
                <img src={url} alt={`preset ${i+1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: fields */}
        <div className="space-y-4">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Nome do Manager</div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{Icons.user(14)}</span>
              <input value={setup.managerName} onChange={e => setSetup((s: CareerSetup) => ({ ...s, managerName: e.target.value }))}
                placeholder="Erick Santos" className="lh-input pl-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Idade do Manager</div>
              <input type="number" min={18} max={70} value={setup.managerAge}
                onChange={e => setSetup((s: CareerSetup) => ({ ...s, managerAge: Number(e.target.value) }))}
                className="lh-input" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Nacionalidade do Manager</div>
              <select value={setup.nationality} onChange={e => setSetup((s: CareerSetup) => ({ ...s, nationality: e.target.value }))}
                className="lh-input cursor-pointer" style={{ appearance:'auto' }}>
                {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Idioma Selecionado</div>
              <select value={setup.language} onChange={e => setSetup((s: CareerSetup) => ({ ...s, language: e.target.value }))}
                className="lh-input cursor-pointer" style={{ appearance:'auto' }}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Moeda Selecionada</div>
              <select value={setup.currency} onChange={e => setSetup((s: CareerSetup) => ({ ...s, currency: e.target.value }))}
                className="lh-input cursor-pointer" style={{ appearance:'auto' }}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent">Voltar</button>
        <button onClick={onNext} disabled={!setup.managerName.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer border-none transition-all"
          style={{ background: setup.managerName.trim() ? '#00e5a0' : 'rgba(255,255,255,0.1)', color: setup.managerName.trim() ? '#0a0e1a' : 'rgba(255,255,255,0.3)' }}>
          Avançar para Seleção de Time →
        </button>
      </div>
    </div>
  )
}

// ── STEP 3 — Select Team ────────────────────────────────────────────
function Step3Team({ setup, setSetup, onNext, onBack }: any) {
  const [league, setLeague] = useState(LEAGUES[0])
  const [selTeam, setSelTeam] = useState(setup.teamId ? TEAMS_BY_LEAGUE[setup.teamLeague]?.find(t => t.id === setup.teamId) || null : null)
  const teams = TEAMS_BY_LEAGUE[league] ?? []

  const handleSelect = (team: typeof teams[0]) => {
    setSelTeam(team)
    setSetup((s: CareerSetup) => ({ ...s, teamId: team.id, teamName: team.name, teamLeague: league }))
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[3px] mb-2" style={{ color:'#00e5a0' }}>Estágio 3 · Associação da Franquia</p>
        <h2 className="font-display font-bold text-2xl uppercase text-white mb-1">Selecione sua Equipe</h2>
        <p className="text-sm text-white/45">Escolha uma organização de League of Legends para iniciar seu caminho como pro manager.</p>
      </div>

      {/* Region tabs */}
      <div className="mb-3">
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Filtrar por Região</div>
        <div className="flex gap-2 flex-wrap">
          {LEAGUES.map(l => (
            <button key={l} onClick={() => { setLeague(l); setSelTeam(null) }}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer border-none transition-all"
              style={{
                background: league===l ? '#00e5a0' : 'rgba(255,255,255,0.05)',
                color: league===l ? '#0a0e1a' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${league===l ? '#00e5a0' : 'rgba(255,255,255,0.1)'}`,
              }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-2">Grid de Instalações de Times</div>

      {/* Team grid + detail */}
      <div className="grid grid-cols-[1fr_220px] gap-3 mb-6">
        {/* Team list */}
        <div className="rounded-xl overflow-hidden" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div className="overflow-y-auto" style={{ maxHeight:300, scrollbarWidth:'none' }}>
            <div className="grid grid-cols-2">
              {teams.map(team => (
                <button key={team.id} onClick={() => handleSelect(team)}
                  className="flex items-center gap-2.5 px-4 py-3 text-left cursor-pointer border-none transition-all border-b border-r"
                  style={{
                    background: selTeam?.id===team.id ? 'rgba(0,229,160,0.08)' : 'transparent',
                    borderColor: 'rgba(255,255,255,0.05)',
                    borderLeft: selTeam?.id===team.id ? '2px solid #00e5a0' : '2px solid transparent',
                  }}>
                  <span className="text-base flex-shrink-0">{team.emoji}</span>
                  <span className="text-sm font-medium text-white truncate flex-1">{team.name}</span>
                  <span className="text-[10px] text-white/30 flex-shrink-0">{team.sigla}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team detail */}
        <div className="rounded-xl flex flex-col items-center justify-start p-5 text-center" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          {selTeam ? (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3" style={{ background:'rgba(255,255,255,0.08)' }}>{selTeam.emoji}</div>
              <div className="text-sm font-bold uppercase text-white mb-1">{selTeam.name} ({selTeam.sigla})</div>
              <div className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3" style={{ background:'rgba(0,229,160,0.15)', color:'#00e5a0' }}>Liga: {league.split(' ')[0]}</div>
              <div className="text-[11px] text-white/45 text-left mb-4 leading-relaxed">{selTeam.desc}</div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px]"><span className="text-white/40 uppercase tracking-wide">Orçamento de Caixa</span><span className="font-bold" style={{ color:'#00e5a0' }}>{selTeam.budget}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-white/40 uppercase tracking-wide">Torcida Ativa</span><span className="font-bold text-white/70">{selTeam.fanbase}</span></div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white/40 uppercase tracking-wide">Prestígio Internacional</span>
                  <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><span key={i} style={{ color: i<selTeam.prestige ? '#ffd700' : 'rgba(255,255,255,0.15)', fontSize:12 }}>★</span>)}</div>
                </div>
                <div className="flex justify-between text-[10px]"><span className="text-white/40 uppercase tracking-wide">Tier Computado</span><span className="font-bold" style={{ color:'#00e5a0' }}>{selTeam.tier}</span></div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/20">
              <span className="text-4xl mb-2">🏆</span>
              <span className="text-xs">Selecione um time</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent">Voltar</button>
        <button onClick={onNext} disabled={!selTeam}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer border-none transition-all"
          style={{ background: selTeam ? '#00e5a0' : 'rgba(255,255,255,0.1)', color: selTeam ? '#0a0e1a' : 'rgba(255,255,255,0.3)' }}>
          Conferir & Iniciar →
        </button>
      </div>
    </div>
  )
}

// ── STEP 4 — Confirm ────────────────────────────────────────────────
function Step4Confirm({ setup, onStart, onBack }: any) {
  const dbName = DB_OPTIONS.find(d => d.id === setup.db)?.name ?? setup.db.toUpperCase()
  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[3px] mb-2" style={{ color:'#00e5a0' }}>Estágio 4 · Revisão Final de Contrato</p>
        <h2 className="font-display font-bold text-2xl uppercase text-white mb-2">Conferir e Iniciar</h2>
        <p className="text-sm text-white/45">Tudo pronto para oficializar a sua contratação como Manager. Verifique os dados operacionais do novo save:</p>
      </div>

      {/* Manager vs Team */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-5">
        <div className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color:'#00e5a0' }}>Committed Manager</div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ border:'1px solid rgba(255,255,255,0.1)' }}>
              {setup.photoUrl
                ? <img src={setup.photoUrl} alt="Manager" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-white/10 flex items-center justify-center">{Icons.user(20)}</div>
              }
            </div>
            <div>
              <div className="text-sm font-bold text-white">{setup.managerName || 'Manager'}</div>
              <div className="text-[11px] text-white/45">Idade: <span className="font-bold text-white/70">{setup.managerAge} Anos</span></div>
              <div className="text-[11px] text-white/45">Nacionalidade: <span className="font-bold text-white/70">{setup.nationality}</span></div>
            </div>
          </div>
        </div>

        <div className="text-white/30 font-bold text-sm">VS</div>

        <div className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color:'#00e5a0' }}>Associated Franchise</div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
              {TEAMS_BY_LEAGUE[setup.teamLeague]?.find((t: any) => t.id === setup.teamId)?.emoji ?? '🏆'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{setup.teamName}</div>
              <div className="text-[11px] text-white/45">Região: <span className="font-bold text-white/70">{setup.teamLeague?.split(' ')[0]}</span></div>
              <div className="text-[11px] text-white/45">Orçamento: <span className="font-bold" style={{ color:'#00e5a0' }}>{TEAMS_BY_LEAGUE[setup.teamLeague]?.find((t: any) => t.id === setup.teamId)?.budget}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational info */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { label:'Banco de Dados Ativo', value: dbName },
          { label:'Idioma Operacional',   value: setup.language },
          { label:'Estrutura Financeira', value: setup.currency },
        ].map(item => (
          <div key={item.label} className="p-3.5 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">{item.label}</div>
            <div className="text-sm font-bold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent">Voltar</button>
        <button onClick={onStart}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer border-none"
          style={{ background:'#00e5a0', color:'#0a0e1a' }}>
          [ Começar Carreira ]
        </button>
      </div>
    </div>
  )
}
