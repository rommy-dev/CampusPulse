import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, User } from 'lucide-react'
import Logo from './Logo'

function Sidebar({ userRole }) {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-surface border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
      <div className="flex items-center gap-3 mb-6">
        <Logo size="default" />
        <span className="text-xl font-bold text-primary">CampusPulse</span>
      </div>
      <nav className="space-y-1 w-full">
        <Link 
          to="/dashboard" 
          className={`link-hover flex items-center gap-3 px-4 py-3 rounded-lg text-text-primary ${userRole !== 'admin' ? 'hidden' : ''} ${isActive('/dashboard') ? 'bg-primary text-white' : 'hover:bg-bg'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link 
          to="/formulaire" 
          className={`link-hover flex items-center gap-3 px-4 py-3 rounded-lg text-text-primary ${isActive('/formulaire') ? 'bg-primary text-white' : 'hover:bg-bg'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Formulaire</span>
        </Link>
        <Link 
          to="/profil" 
          className={`link-hover flex items-center gap-3 px-4 py-3 rounded-lg text-text-primary ${isActive('/profil') ? 'bg-primary text-white' : 'hover:bg-bg'}`}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profil</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
