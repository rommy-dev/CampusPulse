import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenue !</h1>
        <p className="text-text-secondary mb-4">Votre compte est vérifié et connecté.</p>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default Dashboard
