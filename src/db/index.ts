import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type {
  Player, Team, LeagueData, Manager,
  Influencer, PressOutlet, Sponsor, Champion,
  GameSave, AppSettings
} from '@/types'

const DB_NAME = 'LegendsHubDB'
const DB_VERSION = 1

interface LHSchema extends DBSchema {
  players:       { key: string; value: Player;      indexes: { byTeam: string; byLeague: string } }
  teams:         { key: string; value: Team;         indexes: { byLeague: string } }
  leagues:       { key: string; value: LeagueData }
  managers:      { key: string; value: Manager;      indexes: { byTeam: string } }
  influencers:   { key: string; value: Influencer }
  press:         { key: string; value: PressOutlet }
  sponsors:      { key: string; value: Sponsor }
  champions:     { key: string; value: Champion }
  saves:         { key: string; value: GameSave;     indexes: { bySlot: number } }
  settings:      { key: string; value: { key: string; value: unknown } }
}

let _db: IDBPDatabase<LHSchema> | null = null

export async function getDB(): Promise<IDBPDatabase<LHSchema>> {
  if (_db) return _db

  _db = await openDB<LHSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Players
      const players = db.createObjectStore('players', { keyPath: 'id' })
      players.createIndex('byTeam',   'teamId',   { unique: false })
      players.createIndex('byLeague', 'leagueId', { unique: false })

      // Teams
      const teams = db.createObjectStore('teams', { keyPath: 'id' })
      teams.createIndex('byLeague', 'leagueId', { unique: false })

      // Leagues
      db.createObjectStore('leagues', { keyPath: 'id' })

      // Managers
      const managers = db.createObjectStore('managers', { keyPath: 'id' })
      managers.createIndex('byTeam', 'teamId', { unique: false })

      // Simple stores
      db.createObjectStore('influencers',  { keyPath: 'id' })
      db.createObjectStore('press',        { keyPath: 'id' })
      db.createObjectStore('sponsors',     { keyPath: 'id' })
      db.createObjectStore('champions',    { keyPath: 'id' })

      // Saves
      const saves = db.createObjectStore('saves', { keyPath: 'id' })
      saves.createIndex('bySlot', 'slot', { unique: true })

      // Settings (key-value)
      db.createObjectStore('settings', { keyPath: 'key' })

      console.log('[lhDB] Schema created — v' + DB_VERSION)
    },
  })

  return _db
}

// ── Generic CRUD ────────────────────────────────────────────────────

export async function dbPut<
  Store extends keyof LHSchema,
  Val extends LHSchema[Store]['value']
>(store: Store, value: Val): Promise<void> {
  const db = await getDB()
  await (db as any).put(store, value)
}

export async function dbGet<
  Store extends keyof LHSchema,
  Val extends LHSchema[Store]['value']
>(store: Store, key: string): Promise<Val | undefined> {
  const db = await getDB()
  return (db as any).get(store, key) as Promise<Val | undefined>
}

export async function dbGetAll<
  Store extends keyof LHSchema,
  Val extends LHSchema[Store]['value']
>(store: Store): Promise<Val[]> {
  const db = await getDB()
  return (db as any).getAll(store) as Promise<Val[]>
}

export async function dbDelete(store: keyof LHSchema, key: string): Promise<void> {
  const db = await getDB()
  await (db as any).delete(store, key)
}

export async function dbClear(store: keyof LHSchema): Promise<void> {
  const db = await getDB()
  await (db as any).clear(store)
}

// ── Settings helpers ────────────────────────────────────────────────

export async function getSetting<T>(key: string, defaultVal: T): Promise<T> {
  const db = await getDB()
  const row = await db.get('settings', key)
  return row ? (row.value as T) : defaultVal
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await getDB()
  await db.put('settings', { key, value })
}

// ── Save slot helpers ───────────────────────────────────────────────

export async function getSaveBySlot(slot: number): Promise<GameSave | undefined> {
  const db = await getDB()
  return db.getFromIndex('saves', 'bySlot', slot)
}

export async function getAllSaves(): Promise<GameSave[]> {
  return dbGetAll('saves')
}

// ── Export / Import ─────────────────────────────────────────────────

type StoreName = keyof LHSchema

export async function exportAllData(): Promise<string> {
  const stores: StoreName[] = [
    'players','teams','leagues','managers',
    'influencers','press','sponsors','champions','saves','settings'
  ]
  const out: Record<string, unknown[]> = {}
  for (const s of stores) {
    out[s as string] = await dbGetAll(s)
  }
  return JSON.stringify(out, null, 2)
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json) as Record<string, unknown[]>
  const stores: StoreName[] = [
    'players','teams','leagues','managers',
    'influencers','press','sponsors','champions','saves','settings'
  ]
  for (const s of stores) {
    if (!data[s as string]) continue
    await dbClear(s)
    for (const row of data[s as string]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await dbPut(s, row as any)
    }
  }
}

// ── Default settings ────────────────────────────────────────────────

export const DEFAULT_SETTINGS: AppSettings = {
  language:              'pt',
  theme:                 'dark',
  matchSpeed:            2,
  difficulty:            'normal',
  autoRejectThreshold:   0,
  hoverPreview:          true,
  keyboardShortcuts:     true,
  accentColor:           false,
}
