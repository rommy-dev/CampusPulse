import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, CheckCircle2, Download, FileText, LayoutDashboard, Users } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { buildResultsWorkbook, downloadBlob } from '../lib/excelExport'
import KpiCard from '../components/KpiCard'
import SurveyChart from '../components/SurveyChart'
import LoadingSpinner from '../components/LoadingSpinner'
import { CHART_COLORS, THEME } from '../lib/statistiquesConstants'

function Dashboard() {
  const [profiles, setProfiles] = useState([])
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')
      const [{ data: profilesData, error: profilesError }, { data: responsesData, error: responsesError }] = await Promise.all([
        supabase.from('profiles').select('id, nom, prenom, email'),
        supabase.from('responses').select('*')
      ])
      if (profilesError) throw profilesError
      if (responsesError) throw responsesError
      setProfiles(profilesData || [])
      setResponses(responsesData || [])
    } catch (err) {
      setError(err.message || 'Impossible de charger le tableau de bord.')
    } finally {
      setLoading(false)
    }
  }

  const overview = useMemo(() => {
    const responseIds = new Set(responses.map((response) => response.user_id).filter(Boolean))
    const completed = profiles.filter((profile) => responseIds.has(profile.id))
    const total = profiles.length
    const completionRate = total ? Math.round((completed.length / total) * 100) : 0
    const transportCounts = {}
    responses.forEach(({ answers = {} }) => {
      if (answers.transport_principal) transportCounts[answers.transport_principal] = (transportCounts[answers.transport_principal] || 0) + 1
    })
    const transportLabels = { pied: 'À pied', taxi_be: 'Taxi-be', covoiturage: 'Covoiturage', velo_moto_deux_roues: 'Vélo/Moto', voiture_personnelle_familiale: 'Voiture', autre: 'Autre' }
    const transportData = Object.entries(transportCounts)
      .map(([key, value]) => ({ name: transportLabels[key] || key, value, pct: responses.length ? Math.round((value / responses.length) * 100) : 0, total: responses.length }))
      .sort((a, b) => b.value - a.value)

    return {
      total, completed: completed.length, pending: Math.max(total - completed.length, 0), completionRate, transportData,
      completionData: [
        { name: 'Formulaires complétés', value: completed.length, pct: completionRate, total },
        { name: 'À compléter', value: Math.max(total - completed.length, 0), pct: 100 - completionRate, total }
      ]
    }
  }, [profiles, responses])

  async function exportQuickly() {
    const responsesByUser = new Map(responses.map((response) => [response.user_id, response]))
    const exportRows = profiles.filter((profile) => responsesByUser.has(profile.id)).map((profile) => ({ ...profile, response: responsesByUser.get(profile.id) }))
    if (!exportRows.length) return setError('Aucun formulaire complété à exporter.')
    try {
      setExporting(true)
      setError('')
      const workbook = await buildResultsWorkbook(exportRows)
      const buffer = await workbook.xlsx.writeBuffer()
      downloadBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `campuspulse_synthese_${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch (err) {
      setError(err.message || 'Erreur lors de l’export rapide.')
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <div className="max-w-6xl mx-auto px-2 md:px-0"><LoadingSpinner message="Chargement du dashboard..." /></div>

  return <div className="max-w-6xl mx-auto px-2 md:px-0 pb-16">
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-primary/10 text-primary"><LayoutDashboard className="w-6 h-6" /></div><div><h1 className="text-2xl md:text-3xl font-bold text-text-primary">Dashboard Admin</h1><p className="text-sm text-text-secondary">Vue d’ensemble des réponses CampusPulse.</p></div></div>
      <div className="flex flex-wrap gap-2"><Link to="/statistiques" className="inline-flex items-center gap-2 rounded-lg border border-text-secondary/20 px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface"><BarChart3 className="w-4 h-4" /> Explorer les statistiques</Link><button type="button" onClick={exportQuickly} disabled={!overview.completed || exporting} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"><Download className="w-4 h-4" /> {exporting ? 'Export en cours...' : 'Export rapide'}</button></div>
    </header>
    {error && <p className="mb-5 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
    <section aria-label="Indicateurs clés" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KpiCard icon={Users} color="text-primary" bg="bg-primary/10" label="Utilisateurs" value={overview.total} unit="inscrits" sub="Base administrée" />
      <KpiCard icon={CheckCircle2} color="text-secondary" bg="bg-secondary/10" label="Réponses" value={overview.completed} unit="complétées" sub={`${overview.completionRate}% de complétion`} />
      <KpiCard icon={FileText} color="text-warning" bg="bg-warning/10" label="À relancer" value={overview.pending} unit="personnes" sub="Formulaire non rempli" />
      <KpiCard icon={BarChart3} color="text-danger" bg="bg-danger/10" label="Taux de réponse" value={overview.completionRate} unit="%" sub="Parmi les inscrits" />
    </section>
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      <div className="lg:col-span-2 bg-surface border border-text-secondary/10 rounded-2xl p-5 shadow-sm"><h2 className="font-bold text-text-primary">Avancement de la collecte</h2><p className="text-xs text-text-secondary mt-1">Part des utilisateurs ayant soumis leur formulaire.</p><SurveyChart data={overview.completionData} theme={THEME} colors={[THEME.secondary, THEME.textSecondary]} height={250} /></div>
      <div className="lg:col-span-3 bg-surface border border-text-secondary/10 rounded-2xl p-5 shadow-sm"><h2 className="font-bold text-text-primary">Modes de transport déclarés</h2><p className="text-xs text-text-secondary mt-1">Aperçu des réponses collectées — détail dans Statistiques.</p>{overview.transportData.length ? <SurveyChart data={overview.transportData} theme={THEME} colors={CHART_COLORS} layout="vertical" yAxisWidth={105} height={250} /> : <p className="flex h-[250px] items-center justify-center text-sm text-text-secondary">Aucune réponse à afficher.</p>}</div>
    </section>
    <section className="rounded-2xl border border-primary/15 bg-primary/5 p-5 md:flex md:items-center md:justify-between gap-5"><div><h2 className="font-bold text-text-primary">Passer à l’analyse détaillée</h2><p className="text-sm text-text-secondary mt-1">Filtrez les thématiques et consultez toutes les distributions de l’enquête.</p></div><Link to="/statistiques" className="mt-4 md:mt-0 inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">Voir les statistiques <ArrowRight className="w-4 h-4" /></Link></section>
  </div>
}

export default Dashboard
