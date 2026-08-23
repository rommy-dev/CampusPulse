import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      onClick={toggleTheme}
      className="btn-press btn-hover flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-primary dark:text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
    </button>
  )
}

export default ThemeToggle