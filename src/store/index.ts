import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings, GameSave } from '@/types'
import { DEFAULT_SETTINGS } from '@/db'

interface AppState {
  // Auth
  isLoggedIn: boolean
  username: string | null

  // Onboarding
  hasAgreedToTerms: boolean
  hasCompletedWelcome: boolean
  hasSelectedLanguage: boolean

  // Settings
  settings: AppSettings

  // Current save
  currentSave: GameSave | null

  // UI state
  activeModal: string | null
  editorSection: string

  // Actions
  setLoggedIn:           (val: boolean, username?: string) => void
  agreeToTerms:          () => void
  completeWelcome:       () => void
  completeLanguageSetup: () => void
  updateSettings:        (patch: Partial<AppSettings>) => void
  setCurrentSave:        (save: GameSave | null) => void
  openModal:             (id: string) => void
  closeModal:            () => void
  setEditorSection:      (section: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn:             false,
      username:               null,
      hasAgreedToTerms:       false,
      hasCompletedWelcome:    false,
      hasSelectedLanguage:    false,
      settings:               DEFAULT_SETTINGS,
      currentSave:            null,
      activeModal:            null,
      editorSection:          'db',

      setLoggedIn:           (val, username) => set({ isLoggedIn: val, username: username ?? null }),
      agreeToTerms:          ()      => set({ hasAgreedToTerms: true }),
      completeWelcome:       ()      => set({ hasCompletedWelcome: true }),
      completeLanguageSetup: ()      => set({ hasSelectedLanguage: true }),
      updateSettings:        (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setCurrentSave:        (save)  => set({ currentSave: save }),
      openModal:             (id)    => set({ activeModal: id }),
      closeModal:            ()      => set({ activeModal: null }),
      setEditorSection:      (s)     => set({ editorSection: s }),
    }),
    {
      name: 'legendshub-app',
      partialize: (s) => ({
        isLoggedIn:             s.isLoggedIn,
        username:               s.username,
        hasAgreedToTerms:       s.hasAgreedToTerms,
        hasCompletedWelcome:    s.hasCompletedWelcome,
        hasSelectedLanguage:    s.hasSelectedLanguage,
        settings:               s.settings,
      }),
    }
  )
)
