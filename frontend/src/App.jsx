import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

function App() {
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    // Handle email verification callback
    const handleAuthCallback = async () => {
      const { data } = await supabase.auth.getSession()
      setSessionChecked(true)
    }
    
    handleAuthCallback()
  }, [])

  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default App