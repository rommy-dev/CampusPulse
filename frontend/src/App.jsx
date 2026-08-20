import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Dashboard from './pages/Dashboard'
import Formulaire from './pages/Formulaire'
import Profil from './pages/Profil'
import Users from './pages/Users'
import Layout from './components/Layout'

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
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/formulaire" replace />} />
        <Route path="dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        <Route path="utilisateurs" element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        } />
        <Route path="formulaire" element={<Formulaire />} />
        <Route path="profil" element={<Profil />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default App