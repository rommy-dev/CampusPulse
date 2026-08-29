import { useEffect, useState } from 'react'
import { BarChart3, CheckCircle2, Download, Eye, UserCircle, X, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { buildResultsWorkbook, downloadBlob } from '../lib/excelExport'
import Badge from '../components/Badge'
import LoadingSpinner from '../components/LoadingSpinner'

function Resultat() {
  const [users, setUsers] = useState([])
  const [responsesByUser, setResponsesByUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchUsersAndResponses()
  }, [])

  async function fetchUsersAndResponses() {
    try {
      setLoading(true)
      setError('')

      const [{ data: profilesData, error: profilesError }, { data: responsesData, error: responsesError }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, nom, prenom, email, avatar_url, role, created_at')
          .order('created_at', { ascending: false }),
        supabase.from('responses').select('*')
      ])

      if (profilesError) throw profilesError
      if (responsesError) throw responsesError

      const responseMap = {}
      ;(responsesData || []).forEach((response) => {
        responseMap[response.user_id] = response
      })

      setUsers(profilesData || [])
      setResponsesByUser(responseMap)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des résultats.')
    } finally {
      setLoading(false)
    }
  }

  async function exportAllResultsExcel() {
    const usersWithResponses = users
      .filter((user) => responsesByUser[user.id])
      .map((user) => ({ ...user, response: responsesByUser[user.id] }))

    if (!usersWithResponses.length) {
      setError('Aucun résultat à exporter.')
      return
    }

    try {
      setError('')
      const workbook = await buildResultsWorkbook(usersWithResponses)
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      downloadBlob(blob, `tous_resultats_${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\u2019export global.')
    }
  }

  async function exportUserResultsExcel(user) {
    const response = responsesByUser[user.id]
    if (!response) {
      setError('Aucun formulaire disponible pour cet utilisateur.')
      return
    }

    try {
      setError('')
      const workbook = await buildResultsWorkbook([{ ...user, response }])
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const fullName = [user.prenom, user.nom].filter(Boolean).join(' ') || user.email || 'utilisateur'
      downloadBlob(blob, `resultat_${fullName.replace(/\s+/g, '_').toLowerCase()}.xlsx`)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\u2019export Excel.')
    }
  }

  function openUserResults(user) {
    const response = responsesByUser[user.id]
    if (!response) return

    setSelectedUser({ ...user, response })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const completedCount = users.filter((user) => !!responsesByUser[user.id]).length

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Résultat</h1>
            <p className="text-sm text-text-secondary">Suivi des formulaires remplis par les utilisateurs</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-surface border border-gray-200 px-3 py-2 rounded-lg text-sm text-text-secondary shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            {completedCount}/{users.length} formulaires complétés
          </div>

          <button
            type="button"
            onClick={exportAllResultsExcel}
            disabled={!completedCount}
            className={[
              'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              completedCount
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            ].join(' ')}
          >
            <Download className="w-4 h-4" />
            Exporter tout
          </button>
        </div>
      </div>

      {error && <Badge type="error" message={error} />}

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => {
            const hasResponse = !!responsesByUser[user.id]
            const fullName = [user.prenom, user.nom].filter(Boolean).join(' ') || user.email || 'Utilisateur'

            return (
              <div
                key={user.id}
                className={[
                  'bg-surface border rounded-2xl p-4 shadow-sm transition-all duration-200',
                  hasResponse ? 'border-gray-200 hover:shadow-md' : 'border-gray-200/80 opacity-60 grayscale-[0.15]'
                ].join(' ')}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={fullName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <UserCircle className={user.avatar_url ? 'hidden' : 'h-8 w-8 text-text-secondary'} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-text-primary truncate">{fullName}</h2>
                    <p className="text-xs text-text-secondary truncate">{user.email || 'Aucun email'}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span
                    className={[
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                      hasResponse
                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                        : 'bg-warning/10 text-warning border border-warning/20'
                    ].join(' ')}
                  >
                    {hasResponse ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Formulaire rempli
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Non rempli
                      </>
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openUserResults(user)}
                  disabled={!hasResponse}
                  className={[
                    'mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    hasResponse
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  ].join(' ')}
                >
                  <Eye className="w-4 h-4" />
                  {hasResponse ? 'Voir le résultat' : 'Indisponible'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-surface rounded-2xl border border-gray-200 shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  {selectedUser.avatar_url ? (
                    <img src={selectedUser.avatar_url} alt={selectedUser.prenom} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle className="h-8 w-8 text-text-secondary" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {[selectedUser.prenom, selectedUser.nom].filter(Boolean).join(' ') || selectedUser.email || 'Utilisateur'}
                  </h3>
                  <p className="text-sm text-text-secondary">Détails du formulaire</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[calc(85vh-92px)] overflow-y-auto px-5 py-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Formulaire soumis
                  </span>
                  <span className="text-sm text-text-secondary">
                    Soumis le {new Date(selectedUser.response.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => exportUserResultsExcel(selectedUser)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exporter Excel
                </button>
              </div>

              <AnswerDetails answers={selectedUser.response.answers} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AnswerDetails({ answers }) {
  if (!answers || typeof answers !== 'object') {
    return <p className="text-sm text-text-secondary">Aucune donnée de réponse disponible.</p>
  }

  return (
    <div className="space-y-3">
      {Object.entries(answers).map(([key, value]) => (
        <div key={key} className="border border-gray-200 rounded-xl p-3 bg-gray-50/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
            {key.replace(/_/g, ' ')}
          </p>
          <div className="text-sm text-text-primary wrap-break-word">
            <RenderAnswerValue value={value} />
          </div>
        </div>
      ))}
    </div>
  )
}

function RenderAnswerValue({ value }) {
  if (value === null || value === undefined) {
    return '—'
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : 'Aucun'
  }

  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }

  if (typeof value === 'object') {
    return (
      <div className="space-y-2 pl-2 border-l border-gray-200">
        {Object.entries(value).map(([nestedKey, nestedValue]) => (
          <div key={nestedKey} className="space-y-1">
            <p className="font-medium text-text-primary">{nestedKey.replace(/_/g, ' ')}</p>
            <div className="text-text-secondary">
              <RenderAnswerValue value={nestedValue} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return String(value)
}

export default Resultat
