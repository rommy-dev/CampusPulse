import { LayoutDashboard } from 'lucide-react'

function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Dashboard Admin</h1>
      </div>
      <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <p className="text-text-secondary text-sm md:text-base">Bienvenue sur le dashboard administrateur.</p>
      </div>
    </div>
  )
}

export default Dashboard
