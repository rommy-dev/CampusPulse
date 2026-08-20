import { useEffect, useState } from 'react'
import { UsersIcon, Eye, Edit, Trash2, X, User } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import Badge from '../components/Badge'
import { FILIERES, ANNEES_UNIVERSITAIRES } from '../constants/filieres'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewMode, setViewMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    date_naissance: '',
    genre: '',
    filiere: '',
    annee_universitaire: '',
    role: 'etudiant'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      setUsers(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleView(user) {
    setSelectedUser(user)
    setViewMode(true)
    setEditMode(false)
    setDeleteMode(false)
  }

  function handleEdit(user) {
    setSelectedUser(user)
    setEditForm({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      date_naissance: user.date_naissance || '',
      genre: user.genre || '',
      filiere: user.filiere || '',
      annee_universitaire: user.annee_universitaire || '',
      role: user.role || 'etudiant'
    })
    setEditMode(true)
    setViewMode(false)
    setDeleteMode(false)
  }

  function handleDelete(user) {
    setSelectedUser(user)
    setDeleteMode(true)
    setViewMode(false)
    setEditMode(false)
  }

  function closeModals() {
    setSelectedUser(null)
    setViewMode(false)
    setEditMode(false)
    setDeleteMode(false)
    setSuccess(null)
  }

  async function handleUpdateUser(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', selectedUser.id)

      if (updateError) throw updateError

      setSuccess('Utilisateur mis à jour avec succès')
      await fetchUsers()
      setEditMode(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirmDelete() {
    setError(null)
    setDeleting(true)

    try {
      const { error: deleteError } = await supabase.rpc('delete_user_and_profile', {
        user_id: selectedUser.id
      })

      if (deleteError) throw deleteError

      setSuccess('Utilisateur supprimé avec succès')
      await fetchUsers()
      setDeleteMode(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl w-full min-w-0 mx-auto px-2 md:px-0">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl w-full min-w-0 mx-auto px-2 md:px-0">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <UsersIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          Gestion des Utilisateurs
        </h1>
      </div>

      {error && (
        <Badge
          type="error"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {success && (
        <Badge
          type="success"
          message={success}
          onDismiss={() => setSuccess(null)}
        />
      )}

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10">
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-bg border-b border-text-secondary/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Avatar</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Prénom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Rôle</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Filière</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Année</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-secondary/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">{user.nom || '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{user.prenom || '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{user.email || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {user.role || 'etudiant'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">{user.filiere || '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{user.annee_universitaire || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(user)}
                        className="p-1.5 rounded-lg hover:bg-bg text-text-secondary hover:text-primary transition-colors"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 rounded-lg hover:bg-bg text-text-secondary hover:text-primary transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 rounded-lg hover:bg-bg text-text-secondary hover:text-danger transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewMode && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-text-secondary/10">
              <h2 className="text-lg font-semibold text-text-primary">Détails de l'utilisateur</h2>
              <button
                onClick={closeModals}
                className="p-1 rounded-lg hover:bg-bg text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                {selectedUser.avatar_url ? (
                  <img 
                    src={selectedUser.avatar_url} 
                    alt="" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-text-primary">
                    {selectedUser.prenom} {selectedUser.nom}
                  </p>
                  <p className="text-sm text-text-secondary">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Rôle</p>
                  <p className="text-text-primary">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Date de naissance</p>
                  <p className="text-text-primary">{selectedUser.date_naissance || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Genre</p>
                  <p className="text-text-primary">{selectedUser.genre || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Filière</p>
                  <p className="text-text-primary">{selectedUser.filiere || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-text-secondary">Année universitaire</p>
                  <p className="text-text-primary">{selectedUser.annee_universitaire || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editMode && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-text-secondary/10">
              <h2 className="text-lg font-semibold text-text-primary">Modifier l'utilisateur</h2>
              <button
                onClick={closeModals}
                className="p-1 rounded-lg hover:bg-bg text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Nom</label>
                  <input
                    type="text"
                    value={editForm.nom}
                    onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                    className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editForm.prenom}
                    onChange={(e) => setEditForm({...editForm, prenom: e.target.value})}
                    className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={editForm.date_naissance}
                  onChange={(e) => setEditForm({...editForm, date_naissance: e.target.value})}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Genre</label>
                <select
                  value={editForm.genre}
                  onChange={(e) => setEditForm({...editForm, genre: e.target.value})}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                >
                  <option value="">Sélectionner...</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Rôle</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                >
                  <option value="etudiant">Étudiant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Filière</label>
                <select
                  value={editForm.filiere}
                  onChange={(e) => setEditForm({...editForm, filiere: e.target.value})}
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
                  value={editForm.annee_universitaire}
                  onChange={(e) => setEditForm({...editForm, annee_universitaire: e.target.value})}
                  className="w-full rounded-lg border border-text-secondary/20 bg-transparent px-3 py-2 text-text-primary outline-none focus:border-primary"
                >
                  <option value="">Sélectionner...</option>
                  {ANNEES_UNIVERSITAIRES.map((annee) => (
                    <option key={annee} value={annee}>{annee}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 rounded-lg border border-text-secondary/20 text-text-primary hover:bg-bg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-medium disabled:opacity-60"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteMode && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-text-primary mb-2">Confirmer la suppression</h2>
              <p className="text-text-secondary mb-4">
                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser.prenom} {selectedUser.nom}</strong> ?
                <br /><br />
                <span className="text-sm">Cette action supprimera le profil utilisateur. Le compte d'authentification restera actif mais devra être supprimé manuellement via le dashboard Supabase. Les données de réponses seront conservées.</span>
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModals}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg border border-text-secondary/20 text-text-primary hover:bg-bg transition-colors disabled:opacity-60"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg bg-danger text-white font-medium disabled:opacity-60"
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users