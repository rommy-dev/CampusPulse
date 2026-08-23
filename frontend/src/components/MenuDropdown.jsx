import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import ConfirmModal from './ConfirmModal'

function MenuDropdown({ user, profile, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef(null)
  const { theme, toggleTheme } = useTheme()

  const displayName = profile?.prenom || user?.email?.split('@')[0] || 'Utilisateur'
  const avatarUrl = profile?.avatar_url

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogoutClick = () => {
    setIsOpen(false)
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-press btn-hover flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-primary dark:text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Menu"
      >
        <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            <Link
              to="/profil"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-primary"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium">Profil</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-primary"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-sm font-medium">Thème</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-primary"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Se déconnecter"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        loading={isLoggingOut}
      />
    </div>
  )
}

export default MenuDropdown