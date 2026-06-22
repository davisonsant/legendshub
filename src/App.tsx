import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { getDB } from '@/db'
import LauncherPage from '@/pages/LauncherPage'
import ModalLegalNotice from '@/components/modals/ModalLegalNotice'
import ModalLanguage    from '@/components/modals/ModalLanguage'
import ModalWelcome     from '@/components/modals/ModalWelcome'
import ModalNewCareer   from '@/components/modals/ModalNewCareer'
import ModalAuth        from '@/components/modals/ModalAuth'
import ModalSettings    from '@/components/modals/ModalSettings'
import ModalEditor      from '@/components/modals/ModalEditor'
import ModalCareer     from '@/components/modals/ModalCareer'

export default function App() {
  const {
    hasAgreedToTerms,
    hasSelectedLanguage,
    hasCompletedWelcome,
    activeModal,
  } = useAppStore()

  // Init IndexedDB on mount
  useEffect(() => {
    getDB().then(() => console.log('[LegendsHub] DB ready'))
  }, [])

  return (
    <div className="min-h-screen bg-[#05070d] text-white font-sans overflow-hidden">
      <LauncherPage />

      {/* ── Onboarding flow ── */}
      {!hasAgreedToTerms && <ModalLegalNotice />}
      {hasAgreedToTerms && !hasSelectedLanguage && <ModalLanguage onboarding />}
      {hasAgreedToTerms && hasSelectedLanguage && !hasCompletedWelcome && <ModalWelcome />}

      {/* ── App modals ── */}
      {activeModal === 'newCareer'   && <ModalNewCareer />}
      {activeModal === 'auth-login'  && <ModalAuth defaultTab="login" />}
      {activeModal === 'auth-signup' && <ModalAuth defaultTab="register" />}
      {activeModal === 'settings'    && <ModalSettings />}
      {activeModal === 'editor'      && <ModalEditor />}
      {activeModal === 'language'    && <ModalLanguage />}
      {activeModal === 'career'      && <ModalCareer />}
    </div>
  )
}
