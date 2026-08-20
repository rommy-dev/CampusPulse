import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }
    
    checkSession()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center px-4">
      <LoadingSpinner />
    </div>
  }
  
  if (!session) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default ProtectedRoute
