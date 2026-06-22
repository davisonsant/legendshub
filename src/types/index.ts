// ── Core game types ─────────────────────────────────────────────────

export type League = 'CBLOL' | 'LCK' | 'LEC' | 'LPL' | 'LCS' | 'LCP'
export type Position = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support'
export type DraftStyle = 'Equilibrado' | 'Agressivo' | 'Lento'
export type ManagerProfile = 'Estóico' | 'Explosivo' | 'Analítico' | 'Motivador'
export type SponsorLevel = 'Regional' | 'Nacional' | 'Internacional' | 'Global'
export type ChampionTier = 'C' | 'B' | 'A' | 'S' | 'S+'
export type PatchStatus = 'NORMAL' | 'BUFFED' | 'NERFED'
export type AppTheme = 'dark' | 'light' | 'system'
export type MatchSpeed = 1 | 2 | 4 | 8
export type Difficulty = 'easy' | 'normal' | 'hard'

export interface PlayerAttributes {
  // Mecânica
  farm: number
  trading: number
  skillshots: number
  controle_mecanico: number
  teamfights: number
  combos: number
  controle_de_wave: number
  kiting: number
  posicionamento: number
  // Macro
  visao_de_jogo: number
  controle_de_objetivos: number
  rotacoes: number
  controle_de_visao: number
  leitura_de_mapa: number
  tomada_de_decisao: number
  antecipacao: number
  // Mental
  compostura: number
  concentracao: number
  confianca: number
  adaptabilidade: number
  disciplina: number
  consistencia: number
  // Equipe
  comunicacao: number
  lideranca: number
  sinergia: number
  coordenacao: number
  shotcalling: number
  // Físico
  reflexos: number
  tempo_de_reacao: number
  resistencia: number
  coordenacao_fisica: number
  apm: number
}

export interface Player {
  id: string
  nick: string
  realName: string
  nationality: string
  age: number
  position: Position
  teamId: string
  leagueId: string
  overall: number
  potential: number
  reputation: number
  photoUrl?: string
  isAcademy: boolean
  attrs: PlayerAttributes
  createdAt: number
  updatedAt: number
}

export interface Team {
  id: string
  name: string
  sigla: string
  leagueId: string
  budget: number
  popularity: number
  logoUrl?: string
  createdAt: number
}

export interface LeagueData {
  id: string
  name: string
  sigla: League
  region: string
  logoUrl?: string
}

export interface Manager {
  id: string
  name: string
  age: number
  teamId: string
  leagueId: string
  nationality: string
  draftStyle: DraftStyle
  profile: ManagerProfile
  reputation: number
  photoUrl?: string
}

export interface Influencer {
  id: string
  name: string
  handle: string
  photoUrl?: string
}

export interface PressOutlet {
  id: string
  name: string
  reach: string
  logoUrl?: string
}

export interface Sponsor {
  id: string
  name: string
  segment: string
  level: SponsorLevel
  logoUrl?: string
}

export interface Champion {
  id: string
  name: string
  route: string
  rating: number
  tier: ChampionTier
  patchStatus: PatchStatus
  imageUrl?: string
}

export interface GameSave {
  id: string
  slot: number
  teamId: string
  teamName: string
  season: number
  week: number
  budget: number
  createdAt: number
  updatedAt: number
}

export interface AppSettings {
  language: string
  theme: AppTheme
  matchSpeed: MatchSpeed
  difficulty: Difficulty
  autoRejectThreshold: number
  hoverPreview: boolean
  keyboardShortcuts: boolean
  accentColor: boolean
}
