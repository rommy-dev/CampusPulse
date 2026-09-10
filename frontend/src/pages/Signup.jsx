import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Badge from '../components/Badge'
import { Eye, EyeOff } from 'lucide-react'

function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) setUserRole(profile.role)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) setUserRole(profile.role)
      } else {
        setUserRole(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUserRole(null)
    navigate('/')
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (!form.nom || !form.prenom) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)

    // Créer l'utilisateur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Mettre à jour le profil avec les informations supplémentaires
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        nom: form.nom,
        prenom: form.prenom,
      })
      .eq('id', authData.user.id)

    setLoading(false)

    if (profileError) {
      setError(profileError.message)
      return
    }

    // Confirmation email désactivée côté Supabase : signUp() retourne
    // directement une session valide, l'utilisateur est déjà connecté.
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary selection:text-white transition-colors duration-200">
      <Header 
        session={session} 
        userRole={userRole} 
        handleLogout={handleLogout} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-text-primary/10 rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">Créer un compte</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={form.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Prénom(s)</label>
                <input
                  type="text"
                  required
                  value={form.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && <Badge type="error" message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full rounded-lg bg-primary text-white py-2 h-10 font-medium disabled:opacity-60"
              >
                {loading ? 
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                 : 'Créer mon compte'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-text-secondary">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary">Se connecter</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer session={session} />
    </div>
  )
}

export default Signup