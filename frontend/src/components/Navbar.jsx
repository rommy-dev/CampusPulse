import { supabase } from '../lib/supabaseClient'
import { User as UserIcon, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import Logo from './Logo'

function Navbar({ user, onLogout }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-surface border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="sm:hidden">
              <Logo size="small" />
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-text-secondary">
              <UserIcon className="w-4 h-4 hidden sm:block" />
              <span className="hidden sm:inline">Connecté en tant que <span className="font-semibold text-text-primary">{user?.email}</span></span>
              <span className="sm:hidden font-semibold text-text-primary">{user?.email?.split('@')[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="btn-press btn-hover flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-primary dark:text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            <button 
              onClick={onLogout}
              className="btn-press btn-hover hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
