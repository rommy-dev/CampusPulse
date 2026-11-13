import { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp, Home, Wallet, Droplet, Utensils,
  Laptop, Shirt, FlaskConical, Trash2, Lightbulb,
  Info, User, MapPin, Car, Zap, Leaf
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import { THEME, CHART_COLORS, LABELS } from '../lib/statistiquesConstants'
import { DEMO_RESPONSES } from '../lib/demoData'
import { aggregateAnswers } from '../lib/surveyStats'
import SurveyChart from '../components/SurveyChart'
import ChartCard from '../components/ChartCard'
import TabCarousel from '../components/TabCarousel'

// Use CSS variables at runtime so dark mode works
function useThemeColors() {
  const [colors, setColors] = useState(THEME)

  useEffect(() => {
    const update = () => {
      const style = getComputedStyle(document.documentElement)
      setColors({
        primary: style.getPropertyValue('--color-primary').trim() || THEME.primary,
        secondary: style.getPropertyValue('--color-secondary').trim() || THEME.secondary,
        danger: style.getPropertyValue('--color-danger').trim() || THEME.danger,
        warning: style.getPropertyValue('--color-warning').trim() || THEME.warning,
        textPrimary: style.getPropertyValue('--color-text-primary').trim() || THEME.textPrimary,
        textSecondary: style.getPropertyValue('--color-text-secondary').trim() || THEME.textSecondary,
        surface: style.getPropertyValue('--color-surface').trim() || THEME.surface,
        bg: style.getPropertyValue('--color-bg').trim() || THEME.bg,
      })
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return colors
}

// ── Main component ─────────────────────────────────────────────────────
function Statistiques() {
  const [survey, setSurvey] = useState({ n: 0, counts: {} })
  const [loading, setLoading] = useState(true)
  const [isDemoData, setIsDemoData] = useState(false)
  const [activeTab, setActiveTab] = useState('generales')
  const theme = useThemeColors()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Seuls des comptages par question sont renvoyés, jamais les réponses individuelles.
        const { data, error } = await supabase.rpc('get_survey_stats')
        if (error) throw error
        if (data && data.n > 0) {
          setSurvey(data)
          setIsDemoData(false)
        } else {
          setSurvey(aggregateAnswers(DEMO_RESPONSES))
          setIsDemoData(true)
        }
      } catch {
        setSurvey(aggregateAnswers(DEMO_RESPONSES))
        setIsDemoData(true)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // ── Heavy aggregation ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const n = survey.n || 1

    const counts = survey.counts || {}
    const countsFor = (key, base = {}) => ({ ...base, ...(counts[key] || {}) })
    // Booléens : renvoyés "true" / "false" par le serveur, affichés Oui / Non
    const yesNo = (key) => {
      const c = counts[key] || {}
      return { oui: (c.true || 0) + (c.oui || 0), non: (c.false || 0) + (c.non || 0) }
    }

    // Comptages par question, calculés côté serveur (get_survey_stats)
    const genreCounts = countsFor('genre')
    const trancheAgeCounts = countsFor('tranche_age')
    const residenceCounts = countsFor('residence_principale')
    const loyerCounts = countsFor('loyer_mensuel')
    const financementCounts = countsFor('source_financement')
    const transportPrincipalCounts = countsFor('transport_principal')
    const combineTransportsCounts = countsFor('combine_transports', { oui: 0, non: 0 })
    const dureeTrajetCounts = countsFor('duree_trajet')
    const depenseTransportCounts = countsFor('depense_transport_jour')
    const difficultesTransportCounts = countsFor('difficultes_transport')
    const ledUtiliseCounts = countsFor('led_utilise', { oui: 0, non: 0 })
    const eteintLumieresCounts = countsFor('eteint_lumieres_debranche', { oui: 0, non: 0 })
    const coupuresFrequentesCounts = countsFor('coupures_frequentes', { oui: 0, non: 0 })
    const budgetCounts = countsFor('budget_mensuel_total')
    const postesDepensesCounts = countsFor('postes_depenses')
    const budgetCouvreBesoinsCounts = countsFor('budget_couvre_besoins')
    const accesEauCounts = countsFor('acces_eau_potable')
    const pratiquesEauCounts = countsFor('pratiques_economie_eau')
    const nombreRepasCounts = countsFor('nombre_repas_jour')
    const lieuRepasCounts = countsFor('lieu_repas_principaux')
    const sourceApprovisionnementCounts = countsFor('source_approvisionnement_alimentaire')
    const energieCuissonCounts = countsFor('energie_cuisson')
    const frequenceCollationCounts = countsFor('frequence_collation')
    const depenseAlimentationCounts = countsFor('depense_alimentation_jour')
    const consommationViandePoissonCounts = countsFor('consommation_viande_poisson', { oui: 0, non: 0 })
    const fruitsLegumesLocauxCounts = countsFor('fruits_legumes_locaux_saison', { oui: 0, non: 0 })
    const plastiqueUsageUniqueCounts = countsFor('produits_plastique_usage_unique', { oui: 0, non: 0 })
    const alimentationEquilibreeCounts = countsFor('alimentation_equilibree')
    const gestionRestesCounts = countsFor('gestion_restes_alimentaires')
    const equipementsNumeriquesCounts = countsFor('equipements_numeriques')
    const dureeUtilisationCounts = countsFor('duree_utilisation_appareil')
    const rechargeMultipleCounts = countsFor('recharge_appareils_plusieurs_fois_nuit', { oui: 0, non: 0 })
    const reactionPanneCounts = countsFor('reaction_panne_appareil')
    const eliminationEquipementsCounts = countsFor('elimination_equipements_electroniques')
    // Ancienne faute de frappe dans la clé : les deux variantes sont additionnées
    const nombreTenuesCounts = countsFor('nombre_tenues_semaine')
    Object.entries(counts.nombre_tenutes_semaine || {}).forEach(([k, v]) => {
      nombreTenuesCounts[k] = (nombreTenuesCounts[k] || 0) + v
    })
    const frequenceRenouvellementCounts = countsFor('frequence_renouvellement_vetements')
    const origineAchatCounts = countsFor('origine_achat_vetements')
    const fibresNaturellesCounts = yesNo('possede_fibres_naturelles_locales')
    const methodeLavageCounts = countsFor('methode_lavage_vetements')
    const lessiveEcologiqueCounts = yesNo('lessive_ecologique_utilisee')
    const sechageExterieurCounts = yesNo('sechage_exterieur')
    const repareVetementsCounts = yesNo('repare_vetements')
    const devenirVetementsCounts = countsFor('devenir_vetements_usages')
    const produitsChimiquesCounts = countsFor('produits_chimiques_utilises')
    const litEtiquettesCounts = yesNo('lit_etiquettes_produits')
    const connaitChimieVerteCounts = yesNo('connait_principes_chimie_verte')
    const procedesDurablesCounts = yesNo('procedes_locaux_durables')
    const favorableAteliersCounts = yesNo('favorable_ateliers_ecologiques')
    const typesDechetsCounts = countsFor('types_dechets_produits')
    const contenantsReutilisablesCounts = countsFor('utilise_contenants_reutilisables')
    const triSelectifCounts = countsFor('pratique_tri_selectif')
    const revendBouteillesCounts = yesNo('revend_bouteilles_metaux_collecteurs')
    const lieuEliminationCounts = countsFor('lieu_elimination_dechets')
    const connaitToxiciteCounts = yesNo('connait_toxicite_combustion_plastiques')
    const poubellesSuffisantesCounts = countsFor('poubelles_suffisantes_campus')
    const participationActionsCounts = countsFor('pret_a_participer_actions_environnementales')
    const perceptionUrgenceCounts = countsFor('perception_urgence_dechets')

    // Helper function to build chart data
    const buildChartData = (counts, labelMap) => {
      return Object.entries(labelMap).map(([key, label]) => ({
        name: label,
        value: counts[key] || 0,
        pct: Math.round(((counts[key] || 0) / n) * 100),
        total: n
      }))
    }

    const buildBinaryChartData = (counts, labelMap) => {
      return Object.entries(labelMap).map(([key, label]) => ({
        name: label,
        value: counts[key] || 0,
        pct: Math.round(((counts[key] || 0) / n) * 100),
        total: n
      }))
    }

    const hygieneEngagementData = [
      ['Lecture des étiquettes', litEtiquettesCounts],
      ['Chimie verte', connaitChimieVerteCounts],
      ['Procédés durables', procedesDurablesCounts],
      ['Ateliers écologiques', favorableAteliersCounts]
    ].map(([name, counts]) => ({
      name,
      value: Math.round(((counts.oui || 0) / n) * 100),
      unit: '%'
    }))

    return {
      n,
      // Informations générales
      genreData: buildChartData(genreCounts, LABELS.genre),
      trancheAgeData: buildChartData(trancheAgeCounts, LABELS.tranche_age),
      residenceData: buildChartData(residenceCounts, LABELS.residence_principale),
      loyerData: buildChartData(loyerCounts, LABELS.loyer_mensuel),
      financementData: buildChartData(financementCounts, LABELS.source_financement),

      // Transport
      transportPrincipalData: buildChartData(transportPrincipalCounts, LABELS.transport_principal),
      combineTransportsData: buildBinaryChartData(combineTransportsCounts, { oui: 'Oui', non: 'Non' }),
      dureeTrajetData: buildChartData(dureeTrajetCounts, LABELS.duree_trajet),
      depenseTransportData: buildChartData(depenseTransportCounts, LABELS.depense_transport_jour),
      difficultesTransportData: buildChartData(difficultesTransportCounts, LABELS.difficultes_transport),
      ledUtiliseData: buildBinaryChartData(ledUtiliseCounts, { oui: 'Oui', non: 'Non' }),
      eteintLumieresData: buildBinaryChartData(eteintLumieresCounts, { oui: 'Oui', non: 'Non' }),
      coupuresFrequentesData: buildBinaryChartData(coupuresFrequentesCounts, { oui: 'Oui', non: 'Non' }),

      // Budget & Eau
      budgetData: buildChartData(budgetCounts, LABELS.budget_mensuel_total),
      postesDepensesData: buildChartData(postesDepensesCounts, LABELS.postes_depenses),
      budgetCouvreBesoinsData: buildChartData(budgetCouvreBesoinsCounts, LABELS.budget_couvre_besoins),
      accesEauData: buildChartData(accesEauCounts, LABELS.acces_eau_potable),
      pratiquesEauData: buildChartData(pratiquesEauCounts, LABELS.pratiques_economie_eau),

      // Alimentation
      nombreRepasData: buildChartData(nombreRepasCounts, LABELS.nombre_repas_jour),
      lieuRepasData: buildChartData(lieuRepasCounts, LABELS.lieu_repas_principaux),
      sourceApprovisionnementData: buildChartData(sourceApprovisionnementCounts, LABELS.source_approvisionnement_alimentaire),
      energieCuissonData: buildChartData(energieCuissonCounts, LABELS.energie_cuisson),
      frequenceCollationData: buildChartData(frequenceCollationCounts, LABELS.frequence_collation),
      depenseAlimentationData: buildChartData(depenseAlimentationCounts, LABELS.depense_alimentation_jour),
      consommationViandePoissonData: buildBinaryChartData(consommationViandePoissonCounts, { oui: 'Oui', non: 'Non' }),
      fruitsLegumesLocauxData: buildBinaryChartData(fruitsLegumesLocauxCounts, { oui: 'Oui', non: 'Non' }),
      plastiqueUsageUniqueData: buildBinaryChartData(plastiqueUsageUniqueCounts, { oui: 'Oui', non: 'Non' }),
      alimentationEquilibreeData: buildChartData(alimentationEquilibreeCounts, LABELS.alimentation_equilibree),
      gestionRestesData: buildChartData(gestionRestesCounts, LABELS.gestion_restes_alimentaires),

      // Technologie
      equipementsNumeriquesData: buildChartData(equipementsNumeriquesCounts, LABELS.equipements_numeriques),
      dureeUtilisationData: buildChartData(dureeUtilisationCounts, LABELS.duree_utilisation_appareil),
      rechargeMultipleData: buildBinaryChartData(rechargeMultipleCounts, { oui: 'Oui', non: 'Non' }),
      reactionPanneData: buildChartData(reactionPanneCounts, LABELS.reaction_panne_appareil),
      eliminationEquipementsData: buildChartData(eliminationEquipementsCounts, LABELS.elimination_equipements_electroniques),

      // Vêtements
      nombreTenuesData: buildChartData(nombreTenuesCounts, LABELS.nombre_tenues_semaine),
      frequenceRenouvellementData: buildChartData(frequenceRenouvellementCounts, LABELS.frequence_renouvellement_vetements),
      origineAchatData: buildChartData(origineAchatCounts, LABELS.origine_achat_vetements),
      fibresNaturellesData: buildBinaryChartData(fibresNaturellesCounts, { oui: 'Oui', non: 'Non' }),
      methodeLavageData: buildChartData(methodeLavageCounts, LABELS.methode_lavage_vetements),
      lessiveEcologiqueData: buildBinaryChartData(lessiveEcologiqueCounts, { oui: 'Oui', non: 'Non' }),
      sechageExterieurData: buildBinaryChartData(sechageExterieurCounts, { oui: 'Oui', non: 'Non' }),
      repareVetementsData: buildBinaryChartData(repareVetementsCounts, { oui: 'Oui', non: 'Non' }),
      devenirVetementsData: buildChartData(devenirVetementsCounts, LABELS.devenir_vetements_usages),

      // Hygiène
      produitsChimiquesData: buildChartData(produitsChimiquesCounts, LABELS.produits_chimiques_utilises),
      litEtiquettesData: buildBinaryChartData(litEtiquettesCounts, { oui: 'Oui', non: 'Non' }),
      connaitChimieVerteData: buildBinaryChartData(connaitChimieVerteCounts, { oui: 'Oui', non: 'Non' }),
      procedesDurablesData: buildBinaryChartData(procedesDurablesCounts, { oui: 'Oui', non: 'Non' }),
      favorableAteliersData: buildBinaryChartData(favorableAteliersCounts, { oui: 'Oui', non: 'Non' }),
      hygieneEngagementData,

      // Déchets
      typesDechetsData: buildChartData(typesDechetsCounts, LABELS.types_dechets_produits),
      contenantsReutilisablesData: buildChartData(contenantsReutilisablesCounts, LABELS.contenants_reutilisables),
      triSelectifData: buildChartData(triSelectifCounts, LABELS.tri_selectif),
      revendBouteillesData: buildBinaryChartData(revendBouteillesCounts, { oui: 'Oui', non: 'Non' }),
      lieuEliminationData: buildChartData(lieuEliminationCounts, LABELS.lieu_elimination_dechets),
      connaitToxiciteData: buildBinaryChartData(connaitToxiciteCounts, { oui: 'Oui', non: 'Non' }),
      poubellesSuffisantesData: buildChartData(poubellesSuffisantesCounts, LABELS.poubelles_suffisantes_campus),
      participationActionsData: buildChartData(participationActionsCounts, LABELS.participation_actions),

      // Perception
      perceptionUrgenceData: buildChartData(perceptionUrgenceCounts, LABELS.perception_urgence_dechets)
    }
  }, [survey])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-2 md:px-0">
        <LoadingSpinner message="Chargement des statistiques..." />
      </div>
    )
  }

  const TABS = [
    { id: 'generales', label: 'Informations Générales' },
    { id: 'transport', label: 'Transport & Énergie' },
    { id: 'budget', label: 'Budget & Eau' },
    { id: 'alimentation', label: 'Alimentation' },
    { id: 'technologie', label: 'Technologie' },
    { id: 'vetements', label: 'Vêtements' },
    { id: 'hygiene', label: 'Hygiène' },
    { id: 'dechets', label: 'Déchets' },
    { id: 'perception', label: 'Perception Campus' }
  ]

  const axisStyle = { fontSize: 11, fill: theme.textSecondary }

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0 pb-16">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Statistiques CampusPulse</h1>
          </div>
          <p className="text-text-secondary text-sm mt-1">
            Analyse de l'échantillon d'enquête (n = {stats.n}).
          </p>
        </div>
        {isDemoData && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20 text-xs font-medium">
            <Info className="w-4 h-4" />
            <span>Données d'illustration</span>
          </div>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <TabCarousel tabs={TABS} activeId={activeTab} onChange={setActiveTab} />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — INFORMATIONS GÉNÉRALES
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'generales') && (
        <section className="mb-10">
          <SectionHeader icon={User} title="Informations Générales" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Répartition par Genre" icon={User} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.genreData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={80}
                barSize={30}
                colors={[THEME.primary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Répartition par Tranche d'Âge" icon={User} badge={`n=${stats.n}`}>
              <SurveyChart
                variant="line"
                data={stats.trancheAgeData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={28}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Type de Logement" icon={Home} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.residenceData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={100}
                barSize={25}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Loyer Mensuel" icon={Wallet} badge={`n=${stats.n}`}>
              <SurveyChart
                variant="area"
                data={stats.loyerData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={26}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Sources de Financement" icon={Wallet} badge={`n=${stats.n}`} className="md:col-span-2">
              <SurveyChart
                data={stats.financementData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — TRANSPORT & ÉNERGIE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'transport') && (
        <section className="mb-10">
          <SectionHeader icon={Car} title="Transport & Énergie" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Mode de Transport Principal" icon={Car} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.transportPrincipalData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={100}
                barSize={22}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Durée du Trajet" icon={MapPin} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.dureeTrajetData}
                variant="line"
                theme={theme}
                axisStyle={axisStyle}
                barSize={28}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Dépenses Journalières de Transport" icon={Wallet} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.depenseTransportData}
                variant="area"
                theme={theme}
                axisStyle={axisStyle}
                barSize={30}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Difficultés de Transport" icon={Car} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.difficultesTransportData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={110}
                barSize={20}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Utilisation LED" icon={Lightbulb} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.ledUtiliseData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.primary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Coupures Fréquentes" icon={Zap} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.coupuresFrequentesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════
          SECTION 3 — BUDGET & EAU
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'budget') && (
        <section className="mb-10">
          <SectionHeader icon={Wallet} title="Budget & Eau" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Budget Mensuel Total" icon={Wallet} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.budgetData}
                variant="area"
                theme={theme}
                axisStyle={axisStyle}
                barSize={28}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Postes de Dépenses Principaux" icon={Wallet} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.postesDepensesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : chaque étudiant sélectionne 2 postes.</p>
            </ChartCard>

            <ChartCard title="Le Budget Couvre-t-il les Besoins ?" icon={Wallet} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.budgetCouvreBesoinsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={36}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Accès à l'Eau Potable" icon={Droplet} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.accesEauData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={110}
                barSize={22}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Pratiques d'Économie d'Eau" icon={Droplet} badge={`n=${stats.n}`} className="md:col-span-2">
              <SurveyChart
                data={stats.pratiquesEauData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════
          SECTION 4 — ALIMENTATION
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'alimentation') && (
        <section className="mb-10">
          <SectionHeader icon={Utensils} title="Alimentation" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Nombre de Repas par Jour" icon={Utensils} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.nombreRepasData}
                variant="line"
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Lieu des Repas Principaux" icon={Utensils} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.lieuRepasData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={100}
                barSize={24}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Source d'Approvisionnement" icon={Utensils} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.sourceApprovisionnementData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={110}
                barSize={22}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Énergie de Cuisson" icon={Zap} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.energieCuissonData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={100}
                barSize={22}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Fréquence des Collations" icon={Utensils} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.frequenceCollationData}
                variant="area"
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Dépenses Alimentation Journalières" icon={Wallet} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.depenseAlimentationData}
                variant="area"
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Consommation Viande/Poisson" icon={Utensils} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.consommationViandePoissonData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Fruits & Légumes Locaux" icon={Leaf} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.fruitsLegumesLocauxData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Plastique Usage Unique" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.plastiqueUsageUniqueData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.danger, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Alimentation Équilibrée" icon={Utensils} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.alimentationEquilibreeData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Gestion des Restes Alimentaires" icon={Utensils} badge={`n=${stats.n}`} className="md:col-span-2">
              <SurveyChart
                data={stats.gestionRestesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════
          SECTION 5 — TECHNOLOGIE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'technologie') && (
        <section className="mb-10">
          <SectionHeader icon={Laptop} title="Technologie" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Équipements Numériques Possédés" icon={Laptop} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.equipementsNumeriquesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Durée d'Utilisation des Appareils" icon={Laptop} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.dureeUtilisationData}
                variant="line"
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Recharges Multiples par Nuit" icon={Zap} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.rechargeMultipleData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Réaction en Cas de Panne" icon={Laptop} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.reactionPanneData}
                layout="vertical"
                theme={theme}
                axisStyle={axisStyle}
                yAxisWidth={100}
                barSize={22}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Élimination des Équipements Électroniques" icon={Trash2} badge={`n=${stats.n}`} className="md:col-span-2">
              <SurveyChart
                data={stats.eliminationEquipementsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════
          SECTION 6 — VÊTEMENTS
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'vetements') && (
        <section className="mb-10">
          <SectionHeader icon={Shirt} title="Vêtements" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Nombre de Tenues par Semaine" icon={Shirt} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.nombreTenuesData}
                variant="area"
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Fréquence de Renouvellement" icon={Shirt} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.frequenceRenouvellementData}
                variant="area"
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Origine d'Achat des Vêtements" icon={Shirt} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.origineAchatData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Fibres Naturelles Locales" icon={Leaf} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.fibresNaturellesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Méthode de Lavage" icon={Shirt} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.methodeLavageData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Lessive Écologique" icon={Leaf} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.lessiveEcologiqueData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Séchage Extérieur" icon={Shirt} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.sechageExterieurData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Réparation de Vêtements" icon={Shirt} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.repareVetementsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.primary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Devenir des Vêtements Usagés" icon={Shirt} badge={`n=${stats.n}`} className="md:col-span-2">
              <SurveyChart
                data={stats.devenirVetementsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════
          SECTION 7 — HYGIÈNE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'hygiene') && (
        <section className="mb-10">
          <SectionHeader icon={FlaskConical} title="Hygiène" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Produits Chimiques Utilisés" icon={FlaskConical} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.produitsChimiquesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Lecture des Étiquettes" icon={FlaskConical} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.litEtiquettesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Connaissance Chimie Verte" icon={FlaskConical} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.connaitChimieVerteData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Procédés Locaux Durables" icon={FlaskConical} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.procedesDurablesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.danger, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Favorable aux Ateliers Écologiques" icon={FlaskConical} badge={`n=${stats.n}`} className="md:col-span-2">
              <SurveyChart
                data={stats.favorableAteliersData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.primary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Profil d'Engagement Écologique" icon={Leaf} badge="part de réponses positives" className="md:col-span-2">
              <SurveyChart
                data={stats.hygieneEngagementData}
                variant="radar"
                theme={theme}
                axisStyle={axisStyle}
                colors={[THEME.secondary]}
              />
              <p className="text-[11px] text-text-secondary mt-2">Chaque axe représente le pourcentage de réponses positives à une pratique comparable.</p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════
          SECTION 8 — DÉCHETS
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'dechets') && (
        <section className="mb-10">
          <SectionHeader icon={Trash2} title="Déchets" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Types de Déchets Produits" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.typesDechetsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Utilisation de Contenants Réutilisables" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.contenantsReutilisablesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Pratique du Tri Sélectif" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.triSelectifData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Revente Bouteilles/Métaux" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.revendBouteillesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Lieu d'Élimination des Déchets" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.lieuEliminationData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Connaissance Toxicité Combustion Plastiques" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.connaitToxiciteData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Poubelles Suffisantes sur le Campus" icon={Trash2} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.poubellesSuffisantesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Participation aux Actions Environnementales" icon={Trash2} badge={`n=${stats.n}`} className="md:col-span-2">
              <SurveyChart
                data={stats.participationActionsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════
          SECTION 9 — PERCEPTION CAMPUS
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'perception') && (
        <section className="mb-10">
          <SectionHeader icon={Lightbulb} title="Perception Campus" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Perception de l'Urgence des Déchets" icon={Lightbulb} badge={`n=${stats.n}`}>
              <SurveyChart
                data={stats.perceptionUrgenceData}
                variant="area"
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>
          </div>
        </section>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, color = 'text-primary' }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-text-secondary/10 mb-6">
      <Icon className={`w-5 h-5 ${color}`} />
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
    </div>
  )
}

export default Statistiques
