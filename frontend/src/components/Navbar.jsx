import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LogOut } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import MenuDropdown from './MenuDropdown'
import ConfirmModal from './ConfirmModal'

function Navbar({ user, profile, onLogout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const displayName = profile?.prenom || user?.email?.split('@')[0] || 'Utilisateur'
  const avatarUrl = profile?.avatar_url

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
      setShowLogoutModal(false)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-surface border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="sm:hidden">
              <Logo size="small" />
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-text-secondary">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm md:text-base">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="hidden sm:inline">Bonjour, <span className="font-semibold text-text-primary">{displayName}</span></span>
              <span className="sm:hidden font-semibold text-text-primary">{displayName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <MenuDropdown user={user} profile={profile} onLogout={handleLogoutClick} />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <button 
                onClick={handleLogoutClick}
                className="btn-press btn-hover flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Se déconnecter"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        loading={isLoggingOut}
      />
    </header>
  )
}

export default Navbar
