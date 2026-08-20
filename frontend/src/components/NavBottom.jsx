import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, User, LogOut } from 'lucide-react'

function NavBottom({ userRole, onLogout }) {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 dark:border-gray-700 z-50 md:hidden safe-area-bottom">
      <div className="flex justify-around items-center py-2 pb-4">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${userRole !== 'admin' ? 'hidden' : ''} ${isActive('/dashboard') ? 'text-primary' : 'text-text-secondary'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
        <Link 
          to="/formulaire" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${isActive('/formulaire') ? 'text-primary' : 'text-text-secondary'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium">Formulaire</span>
        </Link>
        <Link 
          to="/profil" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${isActive('/profil') ? 'text-primary' : 'text-text-secondary'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profil</span>
        </Link>
        <button 
          onClick={onLogout}
          className="btn-press flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-secondary min-w-16"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium">Déconnexion</span>
        </button>
      </div>
    </nav>
  )
}

export default NavBottom