import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from './LoadingSpinner'

function AdminRoute({ children }) {
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        setUserRole(profile?.role || 'etudiant')
      } else {
        setUserRole('etudiant')
      }
      
      setLoading(false)
    }
    
    checkUserRole()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center px-4">
      <LoadingSpinner />
    </div>
  }
  
  if (userRole !== 'admin') {
    return <Navigate to="/formulaire" replace />
  }
  
  return children
}

export default AdminRoute
