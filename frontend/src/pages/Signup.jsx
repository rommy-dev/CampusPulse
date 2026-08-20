import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AuthCard from '../components/AuthCard'
import Badge from '../components/Badge'
import { FILIERES, ANNEES_UNIVERSITAIRES } from '../constants/filieres'

function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    genre: '',
    filiere: '',
    annee_universitaire: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

    if (!form.nom || !form.prenom || !form.date_naissance || !form.genre || !form.filiere || !form.annee_universitaire) {
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
        date_naissance: form.date_naissance,
        genre: form.genre,
        filiere: form.filiere,
        annee_universitaire: form.annee_universitaire,
      })
      .eq('id', authData.user.id)

    setLoading(false)

    if (profileError) {
      setError(profileError.message)
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
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Mot de passe</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Date de naissance</label>
          <input
            type="date"
            required
            value={form.date_naissance}
            onChange={(e) => handleChange('date_naissance', e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Genre</label>
          <select
            required
            value={form.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          >
            <option value="">Sélectionner...</option>
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Filière</label>
          <select
            required
            value={form.filiere}
            onChange={(e) => handleChange('filiere', e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          >
            <option value="">Sélectionner...</option>
            {FILIERES.map((groupe) => (
              <optgroup key={groupe.pole} label={groupe.pole}>
                {groupe.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Année universitaire</label>
          <select
            required
            value={form.annee_universitaire}
            onChange={(e) => handleChange('annee_universitaire', e.target.value)}
            className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
          >
            <option value="">Sélectionner...</option>
            {ANNEES_UNIVERSITAIRES.map((annee) => (
              <option key={annee} value={annee}>{annee}</option>
            ))}
          </select>
        </div>

        {error && <Badge type="error" message={error} />}

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