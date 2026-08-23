import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, TrendingUp, BarChart3 } from 'lucide-react'

function NavBottom({ userRole }) {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 dark:border-gray-700 z-50 md:hidden safe-area-bottom">
      <div className="flex justify-around items-center py-2 pb-4">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${userRole !== 'admin' ? 'hidden' : ''} ${isActive('/dashboard') ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
        <Link 
          to="/utilisateurs" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${userRole !== 'admin' ? 'hidden' : ''} ${isActive('/utilisateurs') ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Utilisateurs</span>
        </Link>
        <Link 
          to="/resultat" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${userRole !== 'admin' ? 'hidden' : ''} ${isActive('/resultat') ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Résultat</span>
        </Link>
        <Link 
          to="/statistiques" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${userRole !== 'admin' ? 'hidden' : ''} ${isActive('/statistiques') ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-medium">Stats</span>
        </Link>
        <Link 
          to="/formulaire" 
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-text-primary min-w-16 ${isActive('/formulaire') ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium">Formulaire</span>
        </Link>
      </div>
    </nav>
  )
}

export default NavBottom