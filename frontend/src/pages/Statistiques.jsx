import { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp, Users, Home, Wallet, Droplet, Utensils,
  Laptop, Shirt, FlaskConical, Trash2, Lightbulb,
  Info, User, MapPin, Car, Zap, Leaf
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import { THEME, CHART_COLORS, LABELS } from '../lib/statistiquesConstants'
import { DEMO_RESPONSES } from '../lib/demoData'
import BarChartReusable from '../components/BarChartReusable'
import ChartCard from '../components/ChartCard'
import KpiCard from '../components/KpiCard'
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
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemoData, setIsDemoData] = useState(false)
  const [activeTab, setActiveTab] = useState('tous')
  const theme = useThemeColors()

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('responses').select('*')
      if (error) throw error
      if (data && data.length > 0) {
        setResponses(data)
        setIsDemoData(false)
      } else {
        setResponses(DEMO_RESPONSES)
        setIsDemoData(true)
      }
    } catch {
      setResponses(DEMO_RESPONSES)
      setIsDemoData(true)
    } finally {
      setLoading(false)
    }
  }

  // ── Heavy aggregation ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const n = responses.length || 1

    // Initialize all counters
    const genreCounts = {}
    const trancheAgeCounts = {}
    const residenceCounts = {}
    const loyerCounts = {}
    const financementCounts = {}
    const transportPrincipalCounts = {}
    const combineTransportsCounts = { oui: 0, non: 0 }
    const dureeTrajetCounts = {}
    const depenseTransportCounts = {}
    const difficultesTransportCounts = {}
    const ledUtiliseCounts = { oui: 0, non: 0 }
    const eteintLumieresCounts = { oui: 0, non: 0 }
    const coupuresFrequentesCounts = { oui: 0, non: 0 }
    const budgetCounts = {}
    const postesDepensesCounts = {}
    const budgetCouvreBesoinsCounts = {}
    const accesEauCounts = {}
    const pratiquesEauCounts = {}
    const nombreRepasCounts = {}
    const lieuRepasCounts = {}
    const sourceApprovisionnementCounts = {}
    const energieCuissonCounts = {}
    const frequenceCollationCounts = {}
    const depenseAlimentationCounts = {}
    const consommationViandePoissonCounts = { oui: 0, non: 0 }
    const fruitsLegumesLocauxCounts = { oui: 0, non: 0 }
    const plastiqueUsageUniqueCounts = { oui: 0, non: 0 }
    const alimentationEquilibreeCounts = {}
    const gestionRestesCounts = {}
    const equipementsNumeriquesCounts = {}
    const dureeUtilisationCounts = {}
    const rechargeMultipleCounts = { oui: 0, non: 0 }
    const reactionPanneCounts = {}
    const eliminationEquipementsCounts = {}
    const nombreTenuesCounts = {}
    const frequenceRenouvellementCounts = {}
    const origineAchatCounts = {}
    const fibresNaturellesCounts = { oui: 0, non: 0 }
    const methodeLavageCounts = {}
    const lessiveEcologiqueCounts = { oui: 0, non: 0 }
    const sechageExterieurCounts = { oui: 0, non: 0 }
    const repareVetementsCounts = { oui: 0, non: 0 }
    const devenirVetementsCounts = {}
    const produitsChimiquesCounts = {}
    const litEtiquettesCounts = { oui: 0, non: 0 }
    const connaitChimieVerteCounts = { oui: 0, non: 0 }
    const procedesDurablesCounts = { oui: 0, non: 0 }
    const favorableAteliersCounts = { oui: 0, non: 0 }
    const typesDechetsCounts = {}
    const contenantsReutilisablesCounts = {}
    const triSelectifCounts = {}
    const revendBouteillesCounts = { oui: 0, non: 0 }
    const lieuEliminationCounts = {}
    const connaitToxiciteCounts = { oui: 0, non: 0 }
    const poubellesSuffisantesCounts = {}
    const participationActionsCounts = {}
    const perceptionUrgenceCounts = {}

    responses.forEach((r) => {
      const a = r.answers || {}

      // Informations générales
      if (a.genre) genreCounts[a.genre] = (genreCounts[a.genre] || 0) + 1
      if (a.tranche_age) trancheAgeCounts[a.tranche_age] = (trancheAgeCounts[a.tranche_age] || 0) + 1
      if (a.residence_principale) residenceCounts[a.residence_principale] = (residenceCounts[a.residence_principale] || 0) + 1
      if (a.loyer_mensuel) loyerCounts[a.loyer_mensuel] = (loyerCounts[a.loyer_mensuel] || 0) + 1
      if (Array.isArray(a.source_financement)) {
        a.source_financement.forEach(s => {
          financementCounts[s] = (financementCounts[s] || 0) + 1
        })
      }

      // Transport
      if (a.transport_principal) transportPrincipalCounts[a.transport_principal] = (transportPrincipalCounts[a.transport_principal] || 0) + 1
      if (a.combine_transports) combineTransportsCounts[a.combine_transports] = (combineTransportsCounts[a.combine_transports] || 0) + 1
      if (a.duree_trajet) dureeTrajetCounts[a.duree_trajet] = (dureeTrajetCounts[a.duree_trajet] || 0) + 1
      if (a.depense_transport_jour) depenseTransportCounts[a.depense_transport_jour] = (depenseTransportCounts[a.depense_transport_jour] || 0) + 1
      if (Array.isArray(a.difficultes_transport)) {
        a.difficultes_transport.forEach(d => {
          difficultesTransportCounts[d] = (difficultesTransportCounts[d] || 0) + 1
        })
      }
      if (a.led_utilise) ledUtiliseCounts[a.led_utilise] = (ledUtiliseCounts[a.led_utilise] || 0) + 1
      if (a.eteint_lumieres_debranche) eteintLumieresCounts[a.eteint_lumieres_debranche] = (eteintLumieresCounts[a.eteint_lumieres_debranche] || 0) + 1
      if (a.coupures_frequentes) coupuresFrequentesCounts[a.coupures_frequentes] = (coupuresFrequentesCounts[a.coupures_frequentes] || 0) + 1

      // Budget & Eau
      if (a.budget_mensuel_total) budgetCounts[a.budget_mensuel_total] = (budgetCounts[a.budget_mensuel_total] || 0) + 1
      if (Array.isArray(a.postes_depenses)) {
        a.postes_depenses.forEach(p => {
          postesDepensesCounts[p] = (postesDepensesCounts[p] || 0) + 1
        })
      }
      if (a.budget_couvre_besoins) budgetCouvreBesoinsCounts[a.budget_couvre_besoins] = (budgetCouvreBesoinsCounts[a.budget_couvre_besoins] || 0) + 1
      if (a.acces_eau_potable) accesEauCounts[a.acces_eau_potable] = (accesEauCounts[a.acces_eau_potable] || 0) + 1
      if (Array.isArray(a.pratiques_economie_eau)) {
        a.pratiques_economie_eau.forEach(p => {
          pratiquesEauCounts[p] = (pratiquesEauCounts[p] || 0) + 1
        })
      }

      // Alimentation
      if (a.nombre_repas_jour) nombreRepasCounts[a.nombre_repas_jour] = (nombreRepasCounts[a.nombre_repas_jour] || 0) + 1
      if (a.lieu_repas_principaux) lieuRepasCounts[a.lieu_repas_principaux] = (lieuRepasCounts[a.lieu_repas_principaux] || 0) + 1
      if (a.source_approvisionnement_alimentaire) sourceApprovisionnementCounts[a.source_approvisionnement_alimentaire] = (sourceApprovisionnementCounts[a.source_approvisionnement_alimentaire] || 0) + 1
      if (a.energie_cuisson) energieCuissonCounts[a.energie_cuisson] = (energieCuissonCounts[a.energie_cuisson] || 0) + 1
      if (a.frequence_collation) frequenceCollationCounts[a.frequence_collation] = (frequenceCollationCounts[a.frequence_collation] || 0) + 1
      if (a.depense_alimentation_jour) depenseAlimentationCounts[a.depense_alimentation_jour] = (depenseAlimentationCounts[a.depense_alimentation_jour] || 0) + 1
      if (a.consommation_viande_poisson) consommationViandePoissonCounts[a.consommation_viande_poisson] = (consommationViandePoissonCounts[a.consommation_viande_poisson] || 0) + 1
      if (a.fruits_legumes_locaux_saison) fruitsLegumesLocauxCounts[a.fruits_legumes_locaux_saison] = (fruitsLegumesLocauxCounts[a.fruits_legumes_locaux_saison] || 0) + 1
      if (a.produits_plastique_usage_unique) plastiqueUsageUniqueCounts[a.produits_plastique_usage_unique] = (plastiqueUsageUniqueCounts[a.produits_plastique_usage_unique] || 0) + 1
      if (a.alimentation_equilibree) alimentationEquilibreeCounts[a.alimentation_equilibree] = (alimentationEquilibreeCounts[a.alimentation_equilibree] || 0) + 1
      if (a.gestion_restes_alimentaires) gestionRestesCounts[a.gestion_restes_alimentaires] = (gestionRestesCounts[a.gestion_restes_alimentaires] || 0) + 1

      // Technologie
      if (Array.isArray(a.equipements_numeriques)) {
        a.equipements_numeriques.forEach(e => {
          equipementsNumeriquesCounts[e] = (equipementsNumeriquesCounts[e] || 0) + 1
        })
      }
      if (a.duree_utilisation_appareil) dureeUtilisationCounts[a.duree_utilisation_appareil] = (dureeUtilisationCounts[a.duree_utilisation_appareil] || 0) + 1
      if (a.recharge_appareils_plusieurs_fois_nuit) rechargeMultipleCounts[a.recharge_appareils_plusieurs_fois_nuit] = (rechargeMultipleCounts[a.recharge_appareils_plusieurs_fois_nuit] || 0) + 1
      if (a.reaction_panne_appareil) reactionPanneCounts[a.reaction_panne_appareil] = (reactionPanneCounts[a.reaction_panne_appareil] || 0) + 1
      if (a.elimination_equipements_electroniques) eliminationEquipementsCounts[a.elimination_equipements_electroniques] = (eliminationEquipementsCounts[a.elimination_equipements_electroniques] || 0) + 1

      // Vêtements
      const nombreTenues = a.nombre_tenues_semaine ?? a.nombre_tenutes_semaine
      if (nombreTenues) {
        nombreTenuesCounts[nombreTenues] = (nombreTenuesCounts[nombreTenues] || 0) + 1
      }
      if (a.frequence_renouvellement_vetements) frequenceRenouvellementCounts[a.frequence_renouvellement_vetements] = (frequenceRenouvellementCounts[a.frequence_renouvellement_vetements] || 0) + 1
      if (a.origine_achat_vetements) origineAchatCounts[a.origine_achat_vetements] = (origineAchatCounts[a.origine_achat_vetements] || 0) + 1
      if (a.possede_fibres_naturelles_locales !== null) fibresNaturellesCounts[a.possede_fibres_naturelles_locales ? 'oui' : 'non'] = (fibresNaturellesCounts[a.possede_fibres_naturelles_locales ? 'oui' : 'non'] || 0) + 1
      if (a.methode_lavage_vetements) methodeLavageCounts[a.methode_lavage_vetements] = (methodeLavageCounts[a.methode_lavage_vetements] || 0) + 1
      if (a.lessive_ecologique_utilisee !== null) lessiveEcologiqueCounts[a.lessive_ecologique_utilisee ? 'oui' : 'non'] = (lessiveEcologiqueCounts[a.lessive_ecologique_utilisee ? 'oui' : 'non'] || 0) + 1
      if (a.sechage_exterieur !== null) sechageExterieurCounts[a.sechage_exterieur ? 'oui' : 'non'] = (sechageExterieurCounts[a.sechage_exterieur ? 'oui' : 'non'] || 0) + 1
      if (a.repare_vetements !== null) repareVetementsCounts[a.repare_vetements ? 'oui' : 'non'] = (repareVetementsCounts[a.repare_vetements ? 'oui' : 'non'] || 0) + 1
      if (a.devenir_vetements_usages) devenirVetementsCounts[a.devenir_vetements_usages] = (devenirVetementsCounts[a.devenir_vetements_usages] || 0) + 1

      // Hygiène
      if (Array.isArray(a.produits_chimiques_utilises)) {
        a.produits_chimiques_utilises.forEach(p => {
          produitsChimiquesCounts[p] = (produitsChimiquesCounts[p] || 0) + 1
        })
      }
      if (a.lit_etiquettes_produits !== null) litEtiquettesCounts[a.lit_etiquettes_produits ? 'oui' : 'non'] = (litEtiquettesCounts[a.lit_etiquettes_produits ? 'oui' : 'non'] || 0) + 1
      if (a.connait_principes_chimie_verte !== null) connaitChimieVerteCounts[a.connait_principes_chimie_verte ? 'oui' : 'non'] = (connaitChimieVerteCounts[a.connait_principes_chimie_verte ? 'oui' : 'non'] || 0) + 1
      if (a.procedes_locaux_durables !== null) procedesDurablesCounts[a.procedes_locaux_durables ? 'oui' : 'non'] = (procedesDurablesCounts[a.procedes_locaux_durables ? 'oui' : 'non'] || 0) + 1
      if (a.favorable_ateliers_ecologiques !== null) favorableAteliersCounts[a.favorable_ateliers_ecologiques ? 'oui' : 'non'] = (favorableAteliersCounts[a.favorable_ateliers_ecologiques ? 'oui' : 'non'] || 0) + 1

      // Déchets
      if (Array.isArray(a.types_dechets_produits)) {
        a.types_dechets_produits.forEach(t => {
          typesDechetsCounts[t] = (typesDechetsCounts[t] || 0) + 1
        })
      }
      if (a.utilise_contenants_reutilisables) contenantsReutilisablesCounts[a.utilise_contenants_reutilisables] = (contenantsReutilisablesCounts[a.utilise_contenants_reutilisables] || 0) + 1
      if (a.pratique_tri_selectif) triSelectifCounts[a.pratique_tri_selectif] = (triSelectifCounts[a.pratique_tri_selectif] || 0) + 1
      if (a.revend_bouteilles_metaux_collecteurs !== null) revendBouteillesCounts[a.revend_bouteilles_metaux_collecteurs ? 'oui' : 'non'] = (revendBouteillesCounts[a.revend_bouteilles_metaux_collecteurs ? 'oui' : 'non'] || 0) + 1
      if (a.lieu_elimination_dechets) lieuEliminationCounts[a.lieu_elimination_dechets] = (lieuEliminationCounts[a.lieu_elimination_dechets] || 0) + 1
      if (a.connait_toxicite_combustion_plastiques !== null) connaitToxiciteCounts[a.connait_toxicite_combustion_plastiques ? 'oui' : 'non'] = (connaitToxiciteCounts[a.connait_toxicite_combustion_plastiques ? 'oui' : 'non'] || 0) + 1
      if (a.poubelles_suffisantes_campus) poubellesSuffisantesCounts[a.poubelles_suffisantes_campus] = (poubellesSuffisantesCounts[a.poubelles_suffisantes_campus] || 0) + 1
      if (a.pret_a_participer_actions_environnementales) participationActionsCounts[a.pret_a_participer_actions_environnementales] = (participationActionsCounts[a.pret_a_participer_actions_environnementales] || 0) + 1

      // Perception
      if (a.perception_urgence_dechets) perceptionUrgenceCounts[a.perception_urgence_dechets] = (perceptionUrgenceCounts[a.perception_urgence_dechets] || 0) + 1
    })

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
  }, [responses])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-2 md:px-0">
        <LoadingSpinner message="Chargement des statistiques..." />
      </div>
    )
  }

  const TABS = [
    { id: 'tous', label: 'Vue d\'ensemble' },
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

      {/* ── Vue d'ensemble de l'échantillon ── */}
      <SectionHeader icon={Users} title="Vue d'Ensemble de l'Échantillon" color="text-primary" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Users} color="text-primary" bg="bg-primary/10"
          label="Répondants" value={stats.n} unit="étudiant(e)s"
          sub="Taille de l'échantillon" />
        <KpiCard icon={User} color="text-secondary" bg="bg-secondary/10"
          label="Répartition Genre" value={stats.genreData[0]?.pct || 0} unit="%"
          sub={stats.genreData[0]?.name || ''} />
        <KpiCard icon={Home} color="text-warning" bg="bg-warning/10"
          label="Logement Principal" value={stats.residenceData[0]?.pct || 0} unit="%"
          sub={stats.residenceData[0]?.name || ''} />
        <KpiCard icon={Laptop} color="text-danger" bg="bg-danger/10"
          label="Équipements Numériques" value={stats.equipementsNumeriquesData[0]?.pct || 0} unit="%"
          sub={stats.equipementsNumeriquesData[0]?.name || ''} />
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
              <BarChartReusable
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
              <BarChartReusable
                data={stats.trancheAgeData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={28}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Type de Logement" icon={Home} badge={`n=${stats.n}`}>
              <BarChartReusable
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
              <BarChartReusable
                data={stats.loyerData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={26}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Sources de Financement" icon={Wallet} badge={`n=${stats.n}`} className="md:col-span-2">
              <BarChartReusable
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
              <BarChartReusable
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
              <BarChartReusable
                data={stats.dureeTrajetData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={28}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Dépenses Journalières de Transport" icon={Wallet} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.depenseTransportData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={30}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Difficultés de Transport" icon={Car} badge={`n=${stats.n}`}>
              <BarChartReusable
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
              <BarChartReusable
                data={stats.ledUtiliseData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.primary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Coupures Fréquentes" icon={Zap} badge={`n=${stats.n}`}>
              <BarChartReusable
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
              <BarChartReusable
                data={stats.budgetData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={28}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Postes de Dépenses Principaux" icon={Wallet} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.postesDepensesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : chaque étudiant sélectionne 2 postes.</p>
            </ChartCard>

            <ChartCard title="Le Budget Couvre-t-il les Besoins ?" icon={Wallet} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.budgetCouvreBesoinsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={36}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Accès à l'Eau Potable" icon={Droplet} badge={`n=${stats.n}`}>
              <BarChartReusable
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
              <BarChartReusable
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
              <BarChartReusable
                data={stats.nombreRepasData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Lieu des Repas Principaux" icon={Utensils} badge={`n=${stats.n}`}>
              <BarChartReusable
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
              <BarChartReusable
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
              <BarChartReusable
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
              <BarChartReusable
                data={stats.frequenceCollationData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Dépenses Alimentation Journalières" icon={Wallet} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.depenseAlimentationData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Consommation Viande/Poisson" icon={Utensils} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.consommationViandePoissonData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Fruits & Légumes Locaux" icon={Leaf} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.fruitsLegumesLocauxData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Plastique Usage Unique" icon={Trash2} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.plastiqueUsageUniqueData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.danger, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Alimentation Équilibrée" icon={Utensils} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.alimentationEquilibreeData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Gestion des Restes Alimentaires" icon={Utensils} badge={`n=${stats.n}`} className="md:col-span-2">
              <BarChartReusable
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
              <BarChartReusable
                data={stats.equipementsNumeriquesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Durée d'Utilisation des Appareils" icon={Laptop} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.dureeUtilisationData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Recharges Multiples par Nuit" icon={Zap} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.rechargeMultipleData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Réaction en Cas de Panne" icon={Laptop} badge={`n=${stats.n}`}>
              <BarChartReusable
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
              <BarChartReusable
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
              <BarChartReusable
                data={stats.nombreTenuesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Fréquence de Renouvellement" icon={Shirt} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.frequenceRenouvellementData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Origine d'Achat des Vêtements" icon={Shirt} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.origineAchatData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Fibres Naturelles Locales" icon={Leaf} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.fibresNaturellesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Méthode de Lavage" icon={Shirt} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.methodeLavageData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Lessive Écologique" icon={Leaf} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.lessiveEcologiqueData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Séchage Extérieur" icon={Shirt} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.sechageExterieurData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Réparation de Vêtements" icon={Shirt} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.repareVetementsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.primary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Devenir des Vêtements Usagés" icon={Shirt} badge={`n=${stats.n}`} className="md:col-span-2">
              <BarChartReusable
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
              <BarChartReusable
                data={stats.produitsChimiquesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Lecture des Étiquettes" icon={FlaskConical} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.litEtiquettesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Connaissance Chimie Verte" icon={FlaskConical} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.connaitChimieVerteData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Procédés Locaux Durables" icon={FlaskConical} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.procedesDurablesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.danger, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Favorable aux Ateliers Écologiques" icon={FlaskConical} badge={`n=${stats.n}`} className="md:col-span-2">
              <BarChartReusable
                data={stats.favorableAteliersData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.primary, THEME.textSecondary]}
              />
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
              <BarChartReusable
                data={stats.typesDechetsData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Utilisation de Contenants Réutilisables" icon={Trash2} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.contenantsReutilisablesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Pratique du Tri Sélectif" icon={Trash2} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.triSelectifData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Revente Bouteilles/Métaux" icon={Trash2} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.revendBouteillesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.secondary, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Lieu d'Élimination des Déchets" icon={Trash2} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.lieuEliminationData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Connaissance Toxicité Combustion Plastiques" icon={Trash2} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.connaitToxiciteData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={40}
                colors={[THEME.warning, THEME.textSecondary]}
              />
            </ChartCard>

            <ChartCard title="Poubelles Suffisantes sur le Campus" icon={Trash2} badge={`n=${stats.n}`}>
              <BarChartReusable
                data={stats.poubellesSuffisantesData}
                theme={theme}
                axisStyle={axisStyle}
                barSize={32}
                colors={CHART_COLORS}
              />
            </ChartCard>

            <ChartCard title="Participation aux Actions Environnementales" icon={Trash2} badge={`n=${stats.n}`} className="md:col-span-2">
              <BarChartReusable
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
              <BarChartReusable
                data={stats.perceptionUrgenceData}
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
