import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AuthCard from '../components/AuthCard'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Confirmation email désactivée côté Supabase : signUp() retourne
    // directement une session valide, l'utilisateur est déjà connecté.
    navigate('/')
  }

  return (
    <AuthCard
      title="Créer un compte"
      footer={
        <>
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary">Se connecter</Link>
        </>
      }
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

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary text-white py-2 font-medium disabled:opacity-60"
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>
    </AuthCard>
  )
}

export default Signup