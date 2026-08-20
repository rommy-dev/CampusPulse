import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useProfile } from '../hooks/useProfile'
import { FILIERES, ANNEES_UNIVERSITAIRES } from '../constants/filieres'
import AvatarUpload from '../components/AvatarUpload'
import LoadingSpinner from '../components/LoadingSpinner'
import Badge from '../components/Badge'

function Profil() {
  const { profile, user, loading, refetch } = useProfile()

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    filiere: '',
    annee_universitaire: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        date_naissance: profile.date_naissance || '',
        filiere: profile.filiere || '',
        annee_universitaire: profile.annee_universitaire || '',
      })
    }
  }, [profile])

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const { error: updateError } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', user.id)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-0">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <User className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Profil</h1>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6 space-y-6">
        <AvatarUpload
          userId={user.id}
          avatarUrl={profile?.avatar_url}
          onUploaded={() => refetch()}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-text-secondary/20 bg-bg px-3 py-2 text-text-secondary cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">Prénom(s)</label>
              <input
                type="text"
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
              value={form.date_naissance}
              onChange={(e) => handleChange('date_naissance', e.target.value)}
              className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Filière</label>
            <select
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
          {success && <Badge type="success" message="Profil mis à jour." />}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary text-white px-4 py-2 font-medium disabled:opacity-60"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profil
