// ── Theme-aligned palette ──────────────────────────────────────────────
export const THEME = {
  primary: '#2563EB',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  surface: '#FFFFFF',
  bg: '#F8FAFC',
}

export const CHART_COLORS = [
  THEME.primary,    // blue
  THEME.secondary,  // emerald
  THEME.warning,    // amber
  THEME.danger,     // red
  '#8B5CF6',        // violet
  '#EC4899',        // pink
  '#06B6D4',        // cyan
  '#F97316',        // orange
]

// ── Label maps ─────────────────────────────────────────────────────────
export const LABELS = {
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
    'Cité universitaire (CUR / Vontovorona)': 'Cité U.',
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
  nombre_tenues_semaine: {
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
