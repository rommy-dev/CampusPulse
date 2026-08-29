import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AuthCard from '../components/AuthCard'
import Badge from '../components/Badge'
import ThemeToggle from '../components/ThemeToggle'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/')
  }

  return (
    <AuthCard
      title="Se connecter"
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-primary">S'inscrire</Link>
        </>
      }
      topRightActions={<ThemeToggle />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          />
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
           : 'Se connecter'}
        </button>

        <Link to="/forgot-password" className="block text-center text-sm text-text-secondary">
          Mot de passe oublié ?
        </Link>
      </form>
    </AuthCard>
  )
}

export default Login