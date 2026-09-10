import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import ConfirmModal from './ConfirmModal'
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react'

function Header({ session, userRole, handleLogout, mobileMenuOpen, setMobileMenuOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      await handleLogout()
      setShowLogoutModal(false)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleNavClick = (e, anchor) => {
    e.preventDefault()
    
    if (location.pathname === '/') {
      // Si on est déjà sur la page d'accueil, scroller vers l'ancre
      const element = document.getElementById(anchor)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Sinon, naviguer vers la page d'accueil avec l'ancre
      navigate(`/#${anchor}`)
    }
  }
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/90 border-b border-text-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
        
        {/* Logo & Brand Name */}
        <Link to="/" className="flex items-center gap-3">
          <Logo size="default" />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg md:text-xl tracking-tight text-text-primary flex items-center">
              Campus<span className="text-primary">Pulse</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-text-primary transition-colors cursor-pointer">Mission</a>
          <a href="#piliers" onClick={(e) => handleNavClick(e, 'piliers')} className="hover:text-text-primary transition-colors cursor-pointer">Les 9 Piliers</a>
          <a href="#comment-ca-marche" onClick={(e) => handleNavClick(e, 'comment-ca-marche')} className="hover:text-text-primary transition-colors cursor-pointer">Méthode</a>
          <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-text-primary transition-colors cursor-pointer">FAQ</a>
        </nav>

        {/* Header Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {!session ? (
            <>
              <Link
                to="/login"
                className="btn-press px-4 py-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>Se connecter</span>
              </Link>
              <Link
                to="/signup"
                className="btn-press px-4 py-2 text-sm font-semibold bg-primary hover:bg-blue-600 text-white rounded-md shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>S'inscrire</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to={userRole === 'admin' ? '/dashboard' : '/formulaire'}
                className="btn-press px-4 py-2 text-sm font-semibold bg-primary hover:bg-blue-600 text-white rounded-md shadow-sm transition-all flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Mon espace</span>
              </Link>
              <button
                onClick={handleLogoutClick}
                className="btn-press px-4 py-2 text-sm font-semibold border border-text-secondary/20 text-text-secondary hover:text-danger hover:border-danger/40 rounded-md transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-secondary hover:text-text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-text-primary/10 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-text-secondary">
            <a href="#about" onClick={(e) => { handleNavClick(e, 'about'); setMobileMenuOpen(false) }} className="py-1 cursor-pointer">Mission</a>
            <a href="#piliers" onClick={(e) => { handleNavClick(e, 'piliers'); setMobileMenuOpen(false) }} className="py-1 cursor-pointer">Les 9 Piliers</a>
            <a href="#comment-ca-marche" onClick={(e) => { handleNavClick(e, 'comment-ca-marche'); setMobileMenuOpen(false) }} className="py-1 cursor-pointer">Méthode</a>
            <a href="#faq" onClick={(e) => { handleNavClick(e, 'faq'); setMobileMenuOpen(false) }} className="py-1 cursor-pointer">FAQ</a>
          </nav>
          <div className="pt-3 border-t border-text-primary/10 flex flex-col gap-2">
            {!session ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold border border-text-secondary/20 text-text-primary rounded-md flex items-center justify-center gap-2"
                >
                  <span>Se connecter</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold bg-primary text-white rounded-md flex items-center justify-center gap-2"
                >
                  <span>S'inscrire</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={userRole === 'admin' ? '/dashboard' : '/formulaire'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold bg-primary text-white rounded-md flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Mon espace</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogoutClick()
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold border border-danger/30 text-danger rounded-md flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </>
            )}
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
    </header>
  )
}

export default Header
