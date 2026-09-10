import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { ExternalLink } from 'lucide-react'

function Footer({ session }) {
  const navigate = useNavigate()
  const location = useLocation()

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
    <footer className="bg-surface border-t border-text-primary/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 text-left">
          
          {/* Logo + 1-sentence description */}
          <div className="flex flex-col items-start max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <Logo size="small" />
              <span className="font-bold text-lg text-text-primary tracking-tight">
                Campus<span className="text-primary">Pulse</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              CampusPulse est la plateforme d'évaluation et d'analyse de la vie campus et de la durabilité à l'École Supérieure Polytechnique d'Antananarivo.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col justify-center gap-1.5 text-xs sm:text-sm font-medium text-text-secondary">
            <p className="font-bold text-lg text-text-primary">Liens utiles</p>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-text-primary transition-colors cursor-pointer">Mission</a>
            <a href="#piliers" onClick={(e) => handleNavClick(e, 'piliers')} className="hover:text-text-primary transition-colors cursor-pointer">Les 9 Piliers</a>
            <a href="#comment-ca-marche" onClick={(e) => handleNavClick(e, 'comment-ca-marche')} className="hover:text-text-primary transition-colors cursor-pointer">Méthode</a>
            <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-text-primary transition-colors cursor-pointer">FAQ</a>
            {!session ? (
              <>
                <Link to="/login" className="hover:text-text-primary transition-colors">Se connecter</Link>
                <Link to="/signup" className="hover:text-text-primary transition-colors">S'inscrire</Link>
              </>
            ) : (
              <Link to="/formulaire" className="hover:text-text-primary transition-colors">Mon espace</Link>
            )}
          </div>

          {/* Developer link */}
          <div className="flex flex-col items-start text-xs text-text-secondary space-y-1">
            <div>
              Développé avec <span className="text-danger">❤️</span> par{' '}
              <a
                href="https://rommy.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>rommy.dev</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <span className="text-[11px] text-text-secondary/70">
              © {new Date().getFullYear()} CampusPulse. Tous droits réservés.
            </span>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
