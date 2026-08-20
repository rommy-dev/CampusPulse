import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AuthCard from '../components/AuthCard'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard title="Email envoyé">
        <p className="text-sm text-text-secondary">
          Si un compte existe pour <span className="text-text-primary">{email}</span>, un lien de
          réinitialisation vient d'être envoyé.
        </p>
        <Link to="/login" className="block mt-4 text-sm text-primary">Retour à la connexion</Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Mot de passe oublié">
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

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary text-white py-2 font-medium disabled:opacity-60"
        >
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </button>

        <Link to="/login" className="block text-center text-sm text-text-secondary">
          Retour à la connexion
        </Link>
      </form>
    </AuthCard>
  )
}

export default ForgotPassword