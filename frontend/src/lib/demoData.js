// ── Demo data for when DB is empty ─────────────────────────────────────
export const DEMO_RESPONSES = [
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
      nombre_tenues_semaine: '7_plus',
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
      nombre_tenues_semaine: '1_3',
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
