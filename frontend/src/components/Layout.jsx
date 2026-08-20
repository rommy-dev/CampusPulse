import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import NavBottom from './NavBottom'
import { supabase } from '../lib/supabaseClient'
import { useState, useEffect } from 'react'

function Layout() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('etudiant')
  const navigate = useNavigate()

  useEffect(() => {
    const getUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        
        // Fetch user role from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUserRole(profile.role)
        }
      }
    }
    
    getUserData()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Erreur lors de la déconnexion:', error)
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-bg min-w-0">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1 min-w-0 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
        <NavBottom userRole={userRole} onLogout={handleLogout} />
      </div>
    </div>
  )
}

export default Layout
