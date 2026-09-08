import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  TrendingUp, Users, Home, Wallet, Droplet, Utensils,
  Laptop, Shirt, FlaskConical, Trash2, Lightbulb,
  Info, User, MapPin, Car, Zap, Leaf
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Theme-aligned palette ──────────────────────────────────────────────
const THEME = {
  primary: '#2563EB',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  surface: '#FFFFFF',
  bg: '#F8FAFC',
}

const CHART_COLORS = [
  THEME.primary,    // blue
  THEME.secondary,  // emerald
  THEME.warning,    // amber
  THEME.danger,     // red
  '#8B5CF6',        // violet
  '#EC4899',        // pink
  '#06B6D4',        // cyan
  '#F97316',        // orange
]

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

// ── Custom recharts tooltip ────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload || {}
  return (
    <div className="bg-surface border border-text-secondary/20 rounded-lg px-3 py-2 shadow-lg text-xs">
      {label !== undefined && <p className="font-semibold text-text-primary mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          {entry.unit || ''}
        </p>
      ))}
      {typeof point.pct === 'number' && typeof point.total === 'number' && (
        <p className="font-mono text-text-secondary">
          soit {point.pct}% (n={point.value ?? '?'}/{point.total})
        </p>
      )}
      {typeof point.pct !== 'number' && typeof point.n === 'number' && (
        <p className="font-mono text-text-secondary">échantillon : n={point.n}</p>
      )}
    </div>
  )
}

// ── Demo data for when DB is empty ─────────────────────────────────────
const DEMO_RESPONSES = [
  {
    answers: {
      // Informations générales
      date_naissance: '2000-01-15',
      genre: 'Masculin',
      filiere: 'Génie des Procédés',
      annee_universitaire: 'L3',
      residence_principale: 'Cité universitaire (CUR / Vontovorona)',
      loyer_mensuel: 'Je ne paie pas de loyer (logement familial / cité)',
      source_financement: ['Soutien financier familial', "Bourse d'études"],
      tranche_age: '18_22',
      age_exact: 24,

      // Transport & Consommation
      transport_principal: 'taxi_be',
      autre_transport: null,
      combine_transports: 'non',
      duree_trajet: '15_30min',
      depense_transport_jour: '2000_4000',
      difficultes_transport: ['frequence_insuffisante'],
      led_utilise: 'oui',
      eteint_lumieres_debranche: 'oui',
      coupures_frequentes: 'oui',
      impact_coupures: 'Parfois pas de lumière pour travailler le soir',

      // Budget & Eau
      budget_mensuel_total: '100000_200000',
      postes_depenses: ['alimentation', 'transport'],
      budget_couvre_besoins: 'partiellement',
      acces_eau_potable: 'intermittent',
      pratiques_economie_eau: ['fermer_robinet', 'recuperer_eau'],

      // Alimentation
      nombre_repas_jour: '2_repas',
      lieu_repas_principaux: 'restaurant_universitaire',
      source_approvisionnement_alimentaire: 'cantine_gargotes',
      energie_cuisson: 'ne_cuisine_pas',
      frequence_collation: 'occasionnellement',
      depense_alimentation_jour: '2000_4000',
      consommation_viande_poisson: 'non',
      fruits_legumes_locaux_saison: 'oui',
      produits_plastique_usage_unique: 'oui',
      alimentation_equilibree: 'partiellement',
      gestion_restes_alimentaires: 'conserves',
      impact_chaine_approvisionnement: 'L\'approvisionnement local réduit l\'empreinte carbone',

      // Technologie
      equipements_numeriques: ['smartphone_personnel', 'ordinateur_portable_fixe'],
      duree_utilisation_appareil: '2_4_ans',
      recharge_appareils_plusieurs_fois_nuit: 'non',
      reaction_panne_appareil: 'reparation_technicien_local',
      elimination_equipements_electroniques: 'conservation_chez_moi',
      ecoconception_numerique_suggestion: 'Optimiser les logiciels pour réduire la consommation énergétique',

      // Vêtements
      nombre_tenues_semaine: '4_6',
      frequence_renouvellement_vetements: 'une_fois_an',
      origine_achat_vetements: 'mixte',
      possede_fibres_naturelles_locales: true,
      methode_lavage_vetements: 'lavage_main',
      lessive_ecologique_utilisee: false,
      sechage_exterieur: true,
      repare_vetements: true,
      devenir_vetements_usages: 'dons',

      // Hygiène
      produits_chimiques_utilises: ['savons_gels_douche', 'cosmetiques'],
      lit_etiquettes_produits: false,
      connait_principes_chimie_verte: false,
      procedes_locaux_durables: false,
      favorable_ateliers_ecologiques: true,
      contribution_formation_environnement: 'Mes compétences en chimie peuvent aider à développer des produits écologiques',

      // Déchets
      types_dechets_produits: ['organiques', 'plastiques', 'papiers_cartons'],
      utilise_contenants_reutilisables: 'souvent',
      pratique_tri_selectif: 'parfois',
      revend_bouteilles_metaux_collecteurs: true,
      lieu_elimination_dechets: 'poubelle_publique_dediee',
      connait_toxicite_combustion_plastiques: true,
      poubelles_suffisantes_campus: 'partiellement',
      pret_a_participer_actions_environnementales: 'oui_tout_a_fait_favorable',

      // Perception
      perception_urgence_dechets: 'urgent',
      suggestions_amelioration_campus: 'Plus de poubelles de tri sélectif et campagnes de sensibilisation'
    }
  },
  {
    answers: {
      // Informations générales
      date_naissance: '1999-05-20',
      genre: 'Féminin',
      filiere: 'Génie Chimique',
      annee_universitaire: 'M1',
      residence_principale: 'Logement étudiant en colocation / location en ville (Antananarivo / périphérie)',
      loyer_mensuel: '100 001 à 250 000 Ar',
      source_financement: ['Emploi ou activité rémunérée / Freelance'],
      tranche_age: '23_25',
      age_exact: 25,

      // Transport & Consommation
      transport_principal: 'covoiturage',
      autre_transport: null,
      combine_transports: 'oui',
      duree_trajet: '46min_1h',
      depense_transport_jour: 'plus_4000',
      difficultes_transport: ['cout_eleve', 'routes_mauvais_etat'],
      led_utilise: 'oui',
      eteint_lumieres_debranche: 'non',
      coupures_frequentes: 'non',
      impact_coupures: null,

      // Budget & Eau
      budget_mensuel_total: '200001_350000',
      postes_depenses: ['logement', 'communication'],
      budget_couvre_besoins: 'oui_toujours',
      acces_eau_potable: 'permanent_bonne_qualite',
      pratiques_economie_eau: ['fermer_robinet'],

      // Alimentation
      nombre_repas_jour: '3_repas_ou_plus',
      lieu_repas_principaux: 'maison_cuisine',
      source_approvisionnement_alimentaire: 'marche_local',
      energie_cuisson: 'gaz_butane',
      frequence_collation: 'plusieurs_fois_semaine',
      depense_alimentation_jour: '4001_6000',
      consommation_viande_poisson: 'oui',
      fruits_legumes_locaux_saison: 'oui',
      produits_plastique_usage_unique: 'non',
      alimentation_equilibree: 'oui_tout_a_fait',
      gestion_restes_alimentaires: 'animaux_compostage',
      impact_chaine_approvisionnement: 'Réduire les intermédiaires pour diminuer l\'empreinte carbone',

      // Technologie
      equipements_numeriques: ['smartphone_personnel', 'ordinateur_portable_fixe', 'tablette_tactile'],
      duree_utilisation_appareil: 'moins_2_ans',
      recharge_appareils_plusieurs_fois_nuit: 'oui',
      reaction_panne_appareil: 'rachat_appareil_neuf',
      elimination_equipements_electroniques: 'poubelle_ordinaire',
      ecoconception_numerique_suggestion: 'Développer des applications plus légères et moins gourmandes en énergie',

      // Vêtements
      nombre_tenutes_semaine: '7_plus',
      frequence_renouvellement_vetements: 'plusieurs_fois_an',
      origine_achat_vetements: 'neuf',
      possede_fibres_naturelles_locales: false,
      methode_lavage_vetements: 'machine',
      lessive_ecologique_utilisee: true,
      sechage_exterieur: false,
      repare_vetements: false,
      devenir_vetements_usages: 'revente',

      // Hygiène
      produits_chimiques_utilises: ['savons_gels_douche', 'cosmetiques', 'nettoyage_domestique'],
      lit_etiquettes_produits: true,
      connait_principes_chimie_verte: true,
      procedes_locaux_durables: true,
      favorable_ateliers_ecologiques: true,
      contribution_formation_environnement: 'Je peux contribuer par la recherche sur les procédés chimiques verts',

      // Déchets
      types_dechets_produits: ['plastiques', 'electroniques_toxiques'],
      utilise_contenants_reutilisables: 'parfois',
      pratique_tri_selectif: 'oui_systematiquement',
      revend_bouteilles_metaux_collecteurs: false,
      lieu_elimination_dechets: 'incineration_brulement',
      connait_toxicite_combustion_plastiques: true,
      poubelles_suffisantes_campus: 'non_insuffisant',
      pret_a_participer_actions_environnementales: 'peut_etre',

      // Perception
      perception_urgence_dechets: 'modere',
      suggestions_amelioration_campus: 'Mettre en place un système de collecte des déchets électroniques'
    }
  },
  {
    answers: {
      // Informations générales
      date_naissance: '2001-08-10',
      genre: 'Masculin',
      filiere: 'Génie de l\'Environnement',
      annee_universitaire: 'L2',
      residence_principale: 'Chez vos parents ou en famille',
      loyer_mensuel: 'Je ne paie pas de loyer (logement familial / cité)',
      source_financement: ['Soutien financier familial'],
      tranche_age: '18_22',
      age_exact: 23,

      // Transport & Consommation
      transport_principal: 'pied',
      autre_transport: null,
      combine_transports: 'non',
      duree_trajet: 'moins_15min',
      depense_transport_jour: 'rien',
      difficultes_transport: ['aucune'],
      led_utilise: 'non',
      eteint_lumieres_debranche: 'non',
      coupures_frequentes: 'oui',
      impact_coupures: 'Impact sur mes révisions',

      // Budget & Eau
      budget_mensuel_total: 'moins_100000',
      postes_depenses: ['materiel_scolaire', 'alimentation'],
      budget_couvre_besoins: 'non_rarement',
      acces_eau_potable: 'difficile_courvee',
      pratiques_economie_eau: ['recuperer_eau', 'reparer_fuites'],

      // Alimentation
      nombre_repas_jour: '2_repas',
      lieu_repas_principaux: 'famille_parents',
      source_approvisionnement_alimentaire: 'maison_denrees_familiales',
      energie_cuisson: 'charbon_bois',
      frequence_collation: 'rarement_jamais',
      depense_alimentation_jour: 'moins_2000',
      consommation_viande_poisson: 'non',
      fruits_legumes_locaux_saison: 'oui',
      produits_plastique_usage_unique: 'non',
      alimentation_equilibree: 'partiellement',
      gestion_restes_alimentaires: 'proches_donnes',
      impact_chaine_approvisionnement: 'Les circuits courts sont essentiels pour réduire l\'impact environnemental',

      // Technologie
      equipements_numeriques: ['smartphone_personnel'],
      duree_utilisation_appareil: '5_ans_plus',
      recharge_appareils_plusieurs_fois_nuit: 'non',
      reaction_panne_appareil: 'reparation_soi_meme',
      elimination_equipements_electroniques: 'filiere_collecte_recyclage',
      ecoconception_numerique_suggestion: 'Promouvoir l\'utilisation de logiciels open-source moins gourmands',

      // Vêtements
      nombre_tenutes_semaine: '1_3',
      frequence_renouvellement_vetements: '2_3_ans',
      origine_achat_vetements: 'seconde_main',
      possede_fibres_naturelles_locales: true,
      methode_lavage_vetements: 'lavage_main',
      lessive_ecologique_utilisee: true,
      sechage_exterieur: true,
      repare_vetements: true,
      devenir_vetements_usages: 'reutilisation',

      // Hygiène
      produits_chimiques_utilises: ['savons_gels_douche'],
      lit_etiquettes_produits: false,
      connait_principes_chimie_verte: true,
      procedes_locaux_durables: false,
      favorable_ateliers_ecologiques: true,
      contribution_formation_environnement: 'Sensibiliser aux pratiques écologiques dans mon entourage',

      // Déchets
      types_dechets_produits: ['organiques', 'papiers_cartons'],
      utilise_contenants_reutilisables: 'toujours',
      pratique_tri_selectif: 'oui_systematiquement',
      revend_bouteilles_metaux_collecteurs: true,
      lieu_elimination_dechets: 'poubelle_publique_dediee',
      connait_toxicite_combustion_plastiques: true,
      poubelles_suffisantes_campus: 'partiellement',
      pret_a_participer_actions_environnementales: 'oui_tout_a_fait_favorable',

      // Perception
      perception_urgence_dechets: 'urgent',
      suggestions_amelioration_campus: 'Créer un compost sur le campus pour les déchets organiques'
    }
  }
]

// ── Label maps ─────────────────────────────────────────────────────────
const LABELS = {
  // Informations générales
  genre: {
    'Masculin': 'Masculin',
    'Féminin': 'Féminin'
  },
  tranche_age: {
    'moins_18': '< 18 ans',
    '18_22': '18-22 ans',
    '23_25': '23-25 ans',
    'plus_25': '> 25 ans'
  },
  residence_principale: {
    'Cité universitaire (CUR / Vontovorona)': 'Cité universitaire',
    'Logement étudiant en colocation / location en ville (Antananarivo / périphérie)': 'Colocation/Location',
    'Chez vos parents ou en famille': 'Chez parents',
    'Foyer ou autre type de logement': 'Autre'
  },
  loyer_mensuel: {
    'Je ne paie pas de loyer (logement familial / cité)': 'Pas de loyer',
    'Moins de 50 000 Ar': '< 50k Ar',
    '50 000 à 100 000 Ar': '50-100k Ar',
    '100 001 à 250 000 Ar': '100-250k Ar',
    'Plus de 250 000 Ar': '> 250k Ar'
  },
  source_financement: {
    'Soutien financier familial': 'Famille',
    "Bourse d'études": 'Bourse',
    'Emploi ou activité rémunérée / Freelance': 'Emploi',
    'Économies personnelles': 'Économies'
  },

  // Transport
  transport_principal: {
    'pied': 'À pied',
    'taxi_be': 'Taxi-be',
    'covoiturage': 'Covoiturage',
    'velo_moto_deux_roues': 'Vélo/Moto',
    'voiture_personnelle_familiale': 'Voiture',
    'autre': 'Autre'
  },
  duree_trajet: {
    'moins_15min': '< 15 min',
    '15_30min': '15-30 min',
    '31_45min': '31-45 min',
    '46min_1h': '46min-1h',
    'plus_1h': '> 1h'
  },
  depense_transport_jour: {
    'rien': 'Rien',
    'moins_2000': '< 2k Ar',
    '2000_4000': '2-4k Ar',
    'plus_4000': '> 4k Ar'
  },
  difficultes_transport: {
    'cout_eleve': 'Coût élevé',
    'frequence_insuffisante': 'Fréquence insuffisante',
    'routes_mauvais_etat': 'Routes en mauvais état',
    'insecurite': 'Insécurité',
    'aucune': 'Aucune'
  },

  // Budget & Eau
  budget_mensuel_total: {
    'moins_100000': '< 100k Ar',
    '100000_200000': '100-200k Ar',
    '200001_350000': '200-350k Ar',
    '350001_500000': '350-500k Ar',
    'plus_500000': '> 500k Ar'
  },
  postes_depenses: {
    'logement': 'Logement',
    'transport': 'Transport',
    'alimentation': 'Alimentation',
    'materiel_scolaire': 'Matériel scolaire',
    'communication': 'Communication'
  },
  budget_couvre_besoins: {
    'oui_toujours': 'Oui, toujours',
    'partiellement': 'Partiellement',
    'non_rarement': 'Non, rarement'
  },
  acces_eau_potable: {
    'permanent_bonne_qualite': 'Permanent bonne qualité',
    'intermittent': 'Intermittent',
    'difficile_courvee': 'Difficile/corvée',
    'incertain_traitement': 'Incertain/traitement'
  },
  pratiques_economie_eau: {
    'fermer_robinet': 'Fermer robinet',
    'recuperer_eau': 'Récupérer eau',
    'reparer_fuites': 'Réparer fuites',
    'aucune': 'Aucune'
  },

  // Alimentation
  nombre_repas_jour: {
    '1_repas': '1 repas',
    '2_repas': '2 repas',
    '3_repas_ou_plus': '3+ repas'
  },
  lieu_repas_principaux: {
    'maison_cuisine': 'Maison',
    'gargote_restaurant': 'Gargote/Restaurant',
    'restaurant_universitaire': 'Resto U.',
    'famille_parents': 'Famille'
  },
  source_approvisionnement_alimentaire: {
    'marche_local': 'Marché local',
    'cantine_gargotes': 'Cantine/Gargotes',
    'maison_denrees_familiales': 'Maison/Famille',
    'supermarches_produits_transformes': 'Supermarché'
  },
  energie_cuisson: {
    'charbon_bois': 'Charbon/bois',
    'gaz_butane': 'Gaz butane',
    'electricite': 'Électricité',
    'bois_chauffe': 'Bois de chauffe',
    'ne_cuisine_pas': 'Ne cuisine pas'
  },
  frequence_collation: {
    'tous_les_jours': 'Tous les jours',
    'plusieurs_fois_semaine': 'Plusieurs fois/sem',
    'occasionnellement': 'Occasionnellement',
    'rarement_jamais': 'Rarement/jamais'
  },
  depense_alimentation_jour: {
    'moins_2000': '< 2k Ar',
    '2000_4000': '2-4k Ar',
    '4001_6000': '4-6k Ar',
    'plus_6000': '> 6k Ar'
  },
  alimentation_equilibree: {
    'oui_tout_a_fait': 'Oui, tout à fait',
    'partiellement': 'Partiellement',
    'non_pas_du_tout': 'Non, pas du tout'
  },
  gestion_restes_alimentaires: {
    'conserves': 'Conservés',
    'proches_donnes': 'Donnés',
    'animaux_compostage': 'Animaux/Compost',
    'ordures_menageres': 'Ordures ménagères'
  },

  // Technologie
  equipements_numeriques: {
    'smartphone_personnel': 'Smartphone',
    'ordinateur_portable_fixe': 'Ordinateur',
    'tablette_tactile': 'Tablette',
    'aucun_equipement_personnel': 'Aucun'
  },
  duree_utilisation_appareil: {
    'moins_2_ans': '< 2 ans',
    '2_4_ans': '2-4 ans',
    '5_ans_plus': '5+ ans',
    'panne_totale_irreparable': 'Jusqu\'à panne'
  },
  reaction_panne_appareil: {
    'reparation_technicien_local': 'Réparation technicien',
    'reparation_soi_meme': 'Réparation soi-même',
    'rachat_appareil_neuf': 'Rachat neuf',
    'stockage_dormant': 'Stockage dormant'
  },
  elimination_equipements_electroniques: {
    'conservation_chez_moi': 'Conservation',
    'poubelle_ordinaire': 'Poubelle ordinaire',
    'filiere_collecte_recyclage': 'Recyclage',
    'revente': 'Revente'
  },

  // Vêtements
  nombre_tenutes_semaine: {
    '1_3': '1-3 tenues',
    '4_6': '4-6 tenues',
    '7_plus': '7+ tenues'
  },
  frequence_renouvellement_vetements: {
    'plusieurs_fois_an': 'Plusieurs fois/an',
    'une_fois_an': '1 fois/an',
    '2_3_ans': '2-3 ans',
    'usure_necessite': 'Usure/nécessité'
  },
  origine_achat_vetements: {
    'neuf': 'Neuf',
    'seconde_main': 'Seconde main',
    'mixte': 'Mixte'
  },
  methode_lavage_vetements: {
    'lavage_main': 'Lavage main',
    'machine': 'Machine',
    'laverie_externe': 'Laverie externe'
  },
  devenir_vetements_usages: {
    'dons': 'Dons',
    'revente': 'Revente',
    'reutilisation': 'Réutilisation',
    'jetes_brules': 'Jetés/Brûlés'
  },

  // Hygiène
  produits_chimiques_utilises: {
    'savons_gels_douche': 'Savons/Gels',
    'cosmetiques': 'Cosmétiques',
    'nettoyage_domestique': 'Nettoyage domestique',
    'pharmaceutiques': 'Pharmaceutiques'
  },

  // Déchets
  types_dechets_produits: {
    'organiques': 'Organiques',
    'plastiques': 'Plastiques',
    'papiers_cartons': 'Papiers/Cartons',
    'canettes_verre': 'Canettes/Verre',
    'electroniques_toxiques': 'Électroniques/Toxiques'
  },
  contenants_reutilisables: {
    'toujours': 'Toujours',
    'souvent': 'Souvent',
    'parfois': 'Parfois',
    'jamais': 'Jamais'
  },
  tri_selectif: {
    'oui_systematiquement': 'Oui systématiquement',
    'parfois': 'Parfois',
    'non_jamais': 'Non jamais'
  },
  lieu_elimination_dechets: {
    'poubelle_publique_dediee': 'Poubelle publique',
    'par_terre_espaces_ouverts': 'Par terre',
    'incineration_brulement': 'Incinération/Brûlage'
  },
  poubelles_suffisantes_campus: {
    'oui_tout_a_fait': 'Oui tout à fait',
    'partiellement': 'Partiellement',
    'non_insuffisant': 'Non insuffisant'
  },
  participation_actions: {
    'oui_tout_a_fait_favorable': 'Oui tout à fait',
    'peut_etre': 'Peut-être',
    'non_peu_interesse': 'Non peu intéressé'
  },

  // Perception
  perception_urgence_dechets: {
    'urgent': 'Urgent',
    'modere': 'Modéré',
    'non_prioritaire': 'Non prioritaire'
  }
}

// ── Reusable chart card wrapper ────────────────────────────────────────
function ChartCard({ title, icon: Icon, iconColor = 'text-primary', badge, children, className = '' }) {
  return (
    <div className={`bg-surface border border-text-secondary/10 rounded-2xl p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
          <span>{title}</span>
        </h3>
        {badge && (
          <span className="text-[10px] font-mono text-text-secondary bg-bg px-2 py-0.5 rounded-full border border-text-secondary/10 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
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
    const nombreTenutesCounts = {}
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
      if (a.nombre_tenutes_semaine) nombreTenutesCounts[a.nombre_tenutes_semaine] = (nombreTenutesCounts[a.nombre_tenutes_semaine] || 0) + 1
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
      })).filter(d => d.value > 0)
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
      nombreTenutesData: buildChartData(nombreTenutesCounts, LABELS.nombre_tenutes_semaine),
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
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface border border-text-secondary/10 hover:bg-bg text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — INFORMATIONS GÉNÉRALES
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'generales') && (
        <section className="mb-10">
          <SectionHeader icon={User} title="Informations Générales" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Répartition par Genre" icon={User} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.genreData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={80} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={30} fill={theme.primary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Répartition par Tranche d'Âge" icon={User} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.trancheAgeData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={28} fill={theme.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Type de Logement" icon={Home} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.residenceData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={25} fill={theme.warning}>
                    {stats.residenceData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Loyer Mensuel" icon={Wallet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.loyerData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={26} fill={theme.danger}>
                    {stats.loyerData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sources de Financement" icon={Wallet} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.financementData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.financementData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.transportPrincipalData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={22} fill={theme.primary}>
                    {stats.transportPrincipalData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Durée du Trajet" icon={MapPin} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.dureeTrajetData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={28} fill={theme.secondary}>
                    {stats.dureeTrajetData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Dépenses Journalières de Transport" icon={Wallet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.depenseTransportData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={30} fill={theme.warning}>
                    {stats.depenseTransportData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Difficultés de Transport" icon={Car} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.difficultesTransportData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={20} fill={theme.danger}>
                    {stats.difficultesTransportData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Utilisation LED" icon={Lightbulb} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.ledUtiliseData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.primary}>
                    <Cell fill={theme.primary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Coupures Fréquentes" icon={Zap} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.coupuresFrequentesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.warning}>
                    <Cell fill={theme.warning} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — BUDGET & EAU
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'budget') && (
        <section className="mb-10">
          <SectionHeader icon={Wallet} title="Budget & Eau" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Budget Mensuel Total" icon={Wallet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.budgetData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={28} fill={theme.primary}>
                    {stats.budgetData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Postes de Dépenses Principaux" icon={Wallet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.postesDepensesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.postesDepensesData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : chaque étudiant sélectionne 2 postes.</p>
            </ChartCard>

            <ChartCard title="Le Budget Couvre-t-il les Besoins ?" icon={Wallet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.budgetCouvreBesoinsData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={36} fill={theme.warning}>
                    {stats.budgetCouvreBesoinsData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Accès à l'Eau Potable" icon={Droplet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.accesEauData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={22} fill={theme.primary}>
                    {stats.accesEauData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Pratiques d'Économie d'Eau" icon={Droplet} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.pratiquesEauData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.pratiquesEauData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — ALIMENTATION
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'alimentation') && (
        <section className="mb-10">
          <SectionHeader icon={Utensils} title="Alimentation" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Nombre de Repas par Jour" icon={Utensils} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.nombreRepasData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.primary}>
                    {stats.nombreRepasData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lieu des Repas Principaux" icon={Utensils} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.lieuRepasData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={24} fill={theme.secondary}>
                    {stats.lieuRepasData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Source d'Approvisionnement" icon={Utensils} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.sourceApprovisionnementData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={22} fill={theme.warning}>
                    {stats.sourceApprovisionnementData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Énergie de Cuisson" icon={Zap} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.energieCuissonData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={22} fill={theme.danger}>
                    {stats.energieCuissonData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Fréquence des Collations" icon={Utensils} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.frequenceCollationData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.frequenceCollationData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Dépenses Alimentation Journalières" icon={Wallet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.depenseAlimentationData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.depenseAlimentationData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Consommation Viande/Poisson" icon={Utensils} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.consommationViandePoissonData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.warning}>
                    <Cell fill={theme.warning} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Fruits & Légumes Locaux" icon={Leaf} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.fruitsLegumesLocauxData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.secondary}>
                    <Cell fill={theme.secondary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Plastique Usage Unique" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.plastiqueUsageUniqueData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.danger}>
                    <Cell fill={theme.danger} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Alimentation Équilibrée" icon={Utensils} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.alimentationEquilibreeData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.alimentationEquilibreeData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Gestion des Restes Alimentaires" icon={Utensils} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.gestionRestesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.gestionRestesData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — TECHNOLOGIE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'technologie') && (
        <section className="mb-10">
          <SectionHeader icon={Laptop} title="Technologie" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Équipements Numériques Possédés" icon={Laptop} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.equipementsNumeriquesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.equipementsNumeriquesData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Durée d'Utilisation des Appareils" icon={Laptop} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.dureeUtilisationData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.dureeUtilisationData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Recharges Multipiples par Nuit" icon={Zap} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.rechargeMultipleData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.warning}>
                    <Cell fill={theme.warning} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Réaction en Cas de Panne" icon={Laptop} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.reactionPanneData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={22} fill={theme.danger}>
                    {stats.reactionPanneData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Élimination des Équipements Électroniques" icon={Trash2} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.eliminationEquipementsData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.eliminationEquipementsData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — VÊTEMENTS
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'vetements') && (
        <section className="mb-10">
          <SectionHeader icon={Shirt} title="Vêtements" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Nombre de Tenues par Semaine" icon={Shirt} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.nombreTenutesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.primary}>
                    {stats.nombreTenutesData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Fréquence de Renouvellement" icon={Shirt} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.frequenceRenouvellementData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.frequenceRenouvellementData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Origine d'Achat des Vêtements" icon={Shirt} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.origineAchatData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.warning}>
                    {stats.origineAchatData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Fibres Naturelles Locales" icon={Leaf} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.fibresNaturellesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.secondary}>
                    <Cell fill={theme.secondary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Méthode de Lavage" icon={Shirt} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.methodeLavageData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.methodeLavageData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lessive Écologique" icon={Leaf} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.lessiveEcologiqueData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.secondary}>
                    <Cell fill={theme.secondary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Séchage Extérieur" icon={Shirt} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.sechageExterieurData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.warning}>
                    <Cell fill={theme.warning} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Réparation de Vêtements" icon={Shirt} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.repareVetementsData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.primary}>
                    <Cell fill={theme.primary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Devenir des Vêtements Usagés" icon={Shirt} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.devenirVetementsData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.devenirVetementsData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — HYGIÈNE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'hygiene') && (
        <section className="mb-10">
          <SectionHeader icon={FlaskConical} title="Hygiène" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Produits Chimiques Utilisés" icon={FlaskConical} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.produitsChimiquesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.produitsChimiquesData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Lecture des Étiquettes" icon={FlaskConical} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.litEtiquettesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.secondary}>
                    <Cell fill={theme.secondary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Connaissance Chimie Verte" icon={FlaskConical} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.connaitChimieVerteData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.warning}>
                    <Cell fill={theme.warning} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Procédés Locaux Durables" icon={FlaskConical} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.procedesDurablesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.danger}>
                    <Cell fill={theme.danger} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Favorable aux Ateliers Écologiques" icon={FlaskConical} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.favorableAteliersData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.primary}>
                    <Cell fill={theme.primary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — DÉCHETS
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'dechets') && (
        <section className="mb-10">
          <SectionHeader icon={Trash2} title="Déchets" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Types de Déchets Produits" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.typesDechetsData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.typesDechetsData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            <ChartCard title="Utilisation de Contenants Réutilisables" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.contenantsReutilisablesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.contenantsReutilisablesData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Pratique du Tri Sélectif" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.triSelectifData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.warning}>
                    {stats.triSelectifData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Revente Bouteilles/Métaux" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.revendBouteillesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.secondary}>
                    <Cell fill={theme.secondary} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lieu d'Élimination des Déchets" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.lieuEliminationData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.danger}>
                    {stats.lieuEliminationData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Connaissance Toxicité Combustion Plastiques" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.connaitToxiciteData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={40} fill={theme.warning}>
                    <Cell fill={theme.warning} />
                    <Cell fill={theme.textSecondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Poubelles Suffisantes sur le Campus" icon={Trash2} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.poubellesSuffisantesData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.poubellesSuffisantesData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Participation aux Actions Environnementales" icon={Trash2} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.participationActionsData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary}>
                    {stats.participationActionsData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 9 — PERCEPTION CAMPUS
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'perception') && (
        <section className="mb-10">
          <SectionHeader icon={Lightbulb} title="Perception Campus" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Perception de l'Urgence des Déchets" icon={Lightbulb} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.perceptionUrgenceData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={40} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.primary}>
                    {stats.perceptionUrgenceData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────

function KpiCard({ icon: Icon, color, bg, label, value, unit, sub }) {
  return (
    <div className="bg-surface border border-text-secondary/10 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-3 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`}>
        <Icon className="w-16 h-16" />
      </div>
      <div className={`flex items-center gap-2 text-[11px] font-semibold ${color} uppercase tracking-wider mb-2`}>
        <div className={`p-1.5 rounded-lg ${bg}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-black text-text-primary mb-0.5">
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="text-sm font-semibold text-text-secondary ml-1">{unit}</span>
      </div>
      <p className="text-[11px] text-text-secondary">{sub}</p>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, color = 'text-primary' }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-text-secondary/10 mb-6">
      <Icon className={`w-5 h-5 ${color}`} />
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
    </div>
  )
}

export default Statistiques
