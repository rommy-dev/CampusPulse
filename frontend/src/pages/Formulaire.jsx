import { useState, useEffect, useCallback } from 'react'
import { FileText, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import Badge from '../components/Badge'
import InformationsGenerales from '../components/form/InformationsGenerales'
import TransportConsommation from '../components/form/TransportConsommation'
import BudgetEau from '../components/form/BudgetEau'
import Alimentation from '../components/form/Alimentation'
import HygieneVetements from '../components/form/HygieneVetements'
import ChimieVerte from '../components/form/ChimieVerte'
import Technologie from '../components/form/Technologie'
import ModeDeVie from '../components/form/ModeDeVie'

function Formulaire() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyResponded, setAlreadyResponded] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [stepValidationErrors, setStepValidationErrors] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 8

  const stepTitles = [
    'Informations générales',
    'Transport & Consommation',
    'Budget & Eau',
    'Alimentation',
    'Technologie',
    'Hygiène & Vêtements',
    'Chimie verte',
    'Mode de vie'
  ]

  const calculateAgeInfo = useCallback((dateNaissance) => {
    if (!dateNaissance) return { tranche_age: '', age_exact: '' }

    const birthDate = new Date(dateNaissance)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    // Adjust age if birthday hasn't occurred yet this year
    const ageExact = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age

    // Calculate age range
    let tranche_age = ''
    if (ageExact < 18) {
      tranche_age = 'moins_18'
    } else if (ageExact >= 18 && ageExact <= 22) {
      tranche_age = '18_22'
    } else if (ageExact >= 23 && ageExact <= 25) {
      tranche_age = '23_25'
    } else {
      tranche_age = 'plus_25'
    }

    return { tranche_age, age_exact: ageExact.toString() }
  }, [])

  const [formData, setFormData] = useState({
    // Étape 1: Informations générales
    date_naissance: '',
    genre: '',
    filiere: '',
    annee_universitaire: '',
    residence_principale: '',
    loyer_mensuel: '',
    source_financement: [],
    
    // Étape 2: Transport & Consommation
    transport_principal: '',
    autre_transport: '',
    combine_transports: '',
    duree_trajet: '',
    depense_transport_jour: '',
    difficultes_transport: [],
    led_utilise: '',
    eteint_lumieres_debranche: '',
    coupures_frequentes: '',
    impact_coupures: '',

    // Étape 3: Budget & Eau
    budget_mensuel_total: '',
    postes_depenses: [],
    budget_couvre_besoins: '',
    acces_eau_potable: '',
    pratiques_economie_eau: [],

    // Étape 4: Alimentation
    nombre_repas_jour: '',
    lieu_repas_principaux: '',
    source_approvisionnement_alimentaire: '',
    energie_cuisson: '',
    frequence_collation: '',
    depense_alimentation_jour: '',
    consommation_viande_poisson: '',
    fruits_legumes_locaux_saison: '',
    produits_plastique_usage_unique: '',
    alimentation_equilibree: '',
    gestion_restes_alimentaires: '',
    impact_chaine_approvisionnement: '',

    // Étape 3: Hygiène & Vêtements
    type_hygiene: [],
    hygiene_frequence_jour: '',
    hygiene_frequence_semaine: '',
    lave_cheveux: false,
    lave_cheveux_frequence_semaine: '',
    lave_cheveux_produit: '',
    lessive_methode: '',
    lessive_frequence_semaine: '',
    lessive_nombre_tenues: '',
    type_vetements: [],
    qualite_vetements: [],
    repassage_frequence_semaine: '',
    brushing_utilise: false,
    lisseur_utilise: false,

    // Étape 5: Outils numériques et cycle de vie du matériel
    equipements_numeriques: [],
    duree_utilisation_appareil: '',
    recharge_appareils_plusieurs_fois_nuit: '',
    reaction_panne_appareil: '',
    elimination_equipements_electroniques: '',
    ecoconception_numerique_suggestion: '',    

    // Étape 5: Mode de vie
    alcool_boit: false,
    type_dechet: [],
    ordures_frequence_semaine: '',
    elimination_ordures: [],
    tabac: false,
    cigarettes: false,
    produits_stupéfiants_frequence_semaine: ''
  })

  useEffect(() => {
    checkUserAndResponse()
  }, [])

  const checkUserAndResponse = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      setUser(user)

      const { data: existingResponse, error: responseError } = await supabase
        .from('responses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (responseError && responseError.code !== 'PGRST116') throw responseError

      if (existingResponse) {
        setAlreadyResponded(true)
      }
    } catch (err) {
      setError('Erreur lors du chargement. Veuillez vous reconnecter.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    const stepsWithErrors = new Set()

    // Étape 1: Informations générales
    if (!formData.residence_principale) {
      errors.residence_principale = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }

    if (!formData.loyer_mensuel) {
      errors.loyer_mensuel = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }

    if (!formData.source_financement || formData.source_financement.length === 0) {
      errors.source_financement = 'Veuillez sélectionner au moins une source de financement'
      stepsWithErrors.add(1)
    }

    // Étape 2: Transport & Consommation
    if (!formData.transport_principal) {
      errors.transport_principal = 'Ce champ est obligatoire'
      stepsWithErrors.add(2)
    }

    if (formData.transport_principal === 'autre' && !formData.autre_transport) {
      errors.autre_transport = 'Veuillez préciser votre moyen de transport'
      stepsWithErrors.add(2)
    }

    if (!formData.combine_transports) {
      errors.combine_transports = 'Ce champ est obligatoire'
      stepsWithErrors.add(2)
    }

    if (!formData.duree_trajet) {
      errors.duree_trajet = 'Ce champ est obligatoire'
      stepsWithErrors.add(2)
    }

    if (!formData.depense_transport_jour) {
      errors.depense_transport_jour = 'Ce champ est obligatoire'
      stepsWithErrors.add(2)
    }

    if (
      !formData.difficultes_transport ||
      formData.difficultes_transport.length === 0
    ) {
      errors.difficultes_transport = 'Veuillez sélectionner au moins une difficulté'
      stepsWithErrors.add(2)
    }

    if (!formData.led_utilise) {
      errors.led_utilise = 'Ce champ est obligatoire'
      stepsWithErrors.add(2)
    }

    if (!formData.eteint_lumieres_debranche) {
      errors.eteint_lumieres_debranche = 'Ce champ est obligatoire'
      stepsWithErrors.add(2)
    }

    if (!formData.coupures_frequentes) {
      errors.coupures_frequentes = 'Ce champ est obligatoire'
      stepsWithErrors.add(2)
    }

    // Étape 3: Budget & Eau
    if (!formData.budget_mensuel_total) {
      errors.budget_mensuel_total = 'Ce champ est obligatoire'
      stepsWithErrors.add(3)
    }

    if (
      !formData.postes_depenses ||
      formData.postes_depenses.length !== 2
    ) {
      errors.postes_depenses = 'Veuillez sélectionner exactement deux postes de dépenses'
      stepsWithErrors.add(3)
    }

    if (!formData.budget_couvre_besoins) {
      errors.budget_couvre_besoins = 'Ce champ est obligatoire'
      stepsWithErrors.add(3)
    }

    if (!formData.acces_eau_potable) {
      errors.acces_eau_potable = 'Ce champ est obligatoire'
      stepsWithErrors.add(3)
    }

    if (
      !formData.pratiques_economie_eau ||
      formData.pratiques_economie_eau.length === 0
    ) {
      errors.pratiques_economie_eau =
        'Veuillez sélectionner au moins une pratique'
      stepsWithErrors.add(3)
    }

     // Étape 4: Alimentation
    if (!formData.nombre_repas_jour) {
      errors.nombre_repas_jour = 'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.lieu_repas_principaux) {
      errors.lieu_repas_principaux = 'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.source_approvisionnement_alimentaire) {
      errors.source_approvisionnement_alimentaire =
        'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.energie_cuisson) {
      errors.energie_cuisson = 'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.frequence_collation) {
      errors.frequence_collation = 'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.depense_alimentation_jour) {
      errors.depense_alimentation_jour = 'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.consommation_viande_poisson) {
      errors.consommation_viande_poisson =
        'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.fruits_legumes_locaux_saison) {
      errors.fruits_legumes_locaux_saison =
        'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.produits_plastique_usage_unique) {
      errors.produits_plastique_usage_unique =
        'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.alimentation_equilibree) {
      errors.alimentation_equilibree =
        'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.gestion_restes_alimentaires) {
      errors.gestion_restes_alimentaires =
        'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    if (!formData.impact_chaine_approvisionnement?.trim()) {
      errors.impact_chaine_approvisionnement =
        'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }

    // Étape 5: Outils numériques et cycle de vie du matériel
    if (
      !formData.equipements_numeriques ||
      formData.equipements_numeriques.length === 0
    ) {
      errors.equipements_numeriques =
        'Veuillez sélectionner au moins un équipement'
      stepsWithErrors.add(5)
    }

    if (
      formData.equipements_numeriques.includes('aucun_equipement_personnel') &&
      formData.equipements_numeriques.length > 1
    ) {
      errors.equipements_numeriques =
        'Si vous ne possédez aucun équipement personnel, aucune autre option ne doit être sélectionnée'
      stepsWithErrors.add(5)
    }

    if (!formData.duree_utilisation_appareil) {
      errors.duree_utilisation_appareil = 'Ce champ est obligatoire'
      stepsWithErrors.add(5)
    }

    if (!formData.recharge_appareils_plusieurs_fois_nuit) {
      errors.recharge_appareils_plusieurs_fois_nuit =
        'Ce champ est obligatoire'
      stepsWithErrors.add(5)
    }

    if (!formData.reaction_panne_appareil) {
      errors.reaction_panne_appareil = 'Ce champ est obligatoire'
      stepsWithErrors.add(5)
    }

    if (!formData.elimination_equipements_electroniques) {
      errors.elimination_equipements_electroniques =
        'Ce champ est obligatoire'
      stepsWithErrors.add(5)
    }

    if (!formData.ecoconception_numerique_suggestion?.trim()) {
      errors.ecoconception_numerique_suggestion =
        'Ce champ est obligatoire'
      stepsWithErrors.add(5)
    }
    // Étape 3: Hygiène & Vêtements
    if (!formData.type_hygiene || formData.type_hygiene.length === 0) {
      errors.type_hygiene = 'Ce champ est obligatoire'
      stepsWithErrors.add(3)
    }
    if (formData.hygiene_frequence_jour === '' || formData.hygiene_frequence_jour < 0) {
      errors.hygiene_frequence_jour = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(3)
    }
    if (formData.hygiene_frequence_semaine === '' || formData.hygiene_frequence_semaine < 0) {
      errors.hygiene_frequence_semaine = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(3)
    }
    if (formData.lave_cheveux) {
      if (formData.lave_cheveux_frequence_semaine === '' || formData.lave_cheveux_frequence_semaine < 0) {
        errors.lave_cheveux_frequence_semaine = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(3)
      }
      if (!formData.lave_cheveux_produit) {
        errors.lave_cheveux_produit = 'Ce champ est obligatoire'
        stepsWithErrors.add(3)
      }
    }
    if (!formData.lessive_methode) {
      errors.lessive_methode = 'Ce champ est obligatoire'
      stepsWithErrors.add(3)
    }
    if (formData.lessive_frequence_semaine === '' || formData.lessive_frequence_semaine < 0) {
      errors.lessive_frequence_semaine = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(3)
    }
    if (formData.lessive_nombre_tenues !== '' && formData.lessive_nombre_tenues < 0) {
      errors.lessive_nombre_tenues = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(3)
    }
    if (formData.repassage_frequence_semaine !== '' && formData.repassage_frequence_semaine < 0) {
      errors.repassage_frequence_semaine = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(3)
    }

    // Étape 5: Mode de vie
    if (!formData.type_dechet || formData.type_dechet.length === 0) {
      errors.type_dechet = 'Veuillez sélectionner au moins un type de déchet'
      stepsWithErrors.add(5)
    }
    if (formData.ordures_frequence_semaine === '' || formData.ordures_frequence_semaine < 0) {
      errors.ordures_frequence_semaine = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(5)
    }
    if (!formData.elimination_ordures || formData.elimination_ordures.length === 0) {
      errors.elimination_ordures = 'Veuillez sélectionner au moins un lieu d\'élimination'
      stepsWithErrors.add(5)
    }
    if ((formData.alcool_boit || formData.tabac || formData.cigarettes) && (formData.produits_stupéfiants_frequence_semaine === '' || formData.produits_stupéfiants_frequence_semaine < 0)) {
      errors.produits_stupéfiants_frequence_semaine = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(5)
    }

    setValidationErrors(errors)
    setStepValidationErrors(Array.from(stepsWithErrors).sort())
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous step errors
    setStepValidationErrors([])
    
    if (!validateForm()) {
      // Scroll to the error badge at the bottom
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Compute age info from date_naissance provided by InformationsGenerales
      const ageInfo = calculateAgeInfo(formData.date_naissance)
      const tranche_age = ageInfo.tranche_age || null
      const age_exact = ageInfo.age_exact ? parseInt(ageInfo.age_exact, 10) : null

      const answers = {
        // Informations générales
        date_naissance: formData.date_naissance || null,
        genre: formData.genre || null,
        filiere: formData.filiere || null,
        annee_universitaire: formData.annee_universitaire || null,
        residence_principale: formData.residence_principale || null,
        loyer_mensuel: formData.loyer_mensuel || null,
        source_financement: formData.source_financement || [],
        tranche_age,
        age_exact,

        // Transport & Consommation
        transport_principal: formData.transport_principal || null,
        autre_transport: formData.transport_principal === 'autre'
          ? formData.autre_transport || null
          : null,
        combine_transports: formData.combine_transports || null,
        duree_trajet: formData.duree_trajet || null,
        depense_transport_jour: formData.depense_transport_jour || null,
        difficultes_transport: formData.difficultes_transport || [],
        led_utilise: formData.led_utilise || null,
        eteint_lumieres_debranche: formData.eteint_lumieres_debranche || null,
        coupures_frequentes: formData.coupures_frequentes || null,
        impact_coupures: formData.impact_coupures || null,

        // Budget & Eau
        budget_mensuel_total: formData.budget_mensuel_total || null,
        postes_depenses: formData.postes_depenses || [],
        budget_couvre_besoins: formData.budget_couvre_besoins || null,
        acces_eau_potable: formData.acces_eau_potable || null,
        pratiques_economie_eau: formData.pratiques_economie_eau || [],

        // Alimentation
        nombre_repas_jour: formData.nombre_repas_jour || null,
        lieu_repas_principaux: formData.lieu_repas_principaux || null,
        source_approvisionnement_alimentaire:
          formData.source_approvisionnement_alimentaire || null,
        energie_cuisson: formData.energie_cuisson || null,
        frequence_collation: formData.frequence_collation || null,
        depense_alimentation_jour:
          formData.depense_alimentation_jour || null,
        consommation_viande_poisson:
          formData.consommation_viande_poisson || null,
        fruits_legumes_locaux_saison:
          formData.fruits_legumes_locaux_saison || null,
        produits_plastique_usage_unique:
          formData.produits_plastique_usage_unique || null,
        alimentation_equilibree:
          formData.alimentation_equilibree || null,
        gestion_restes_alimentaires:
          formData.gestion_restes_alimentaires || null,
        impact_chaine_approvisionnement:
          formData.impact_chaine_approvisionnement || null,

        // Outils numériques et cycle de vie du matériel
        equipements_numeriques: formData.equipements_numeriques || [],
        duree_utilisation_appareil:
          formData.duree_utilisation_appareil || null,
        recharge_appareils_plusieurs_fois_nuit:
          formData.recharge_appareils_plusieurs_fois_nuit || null,
        reaction_panne_appareil:
          formData.reaction_panne_appareil || null,
        elimination_equipements_electroniques:
          formData.elimination_equipements_electroniques || null,
        ecoconception_numerique_suggestion:
          formData.ecoconception_numerique_suggestion?.trim() || null,

        type_hygiene: formData.type_hygiene,
        hygiene_frequence_jour: parseInt(formData.hygiene_frequence_jour),
        hygiene_frequence_semaine: parseInt(formData.hygiene_frequence_semaine),
        lave_cheveux: formData.lave_cheveux,
        ...(formData.lave_cheveux && {
          lave_cheveux_frequence_semaine: parseInt(formData.lave_cheveux_frequence_semaine),
          lave_cheveux_produit: formData.lave_cheveux_produit
        }),
        lessive_methode: formData.lessive_methode,
        lessive_frequence_semaine: parseInt(formData.lessive_frequence_semaine),
        ...(formData.lessive_nombre_tenues !== '' && { lessive_nombre_tenues: parseInt(formData.lessive_nombre_tenues) }),
        type_vetements: formData.type_vetements,
        qualite_vetements: formData.qualite_vetements,
        ...(formData.repassage_frequence_semaine !== '' && { repassage_frequence_semaine: parseInt(formData.repassage_frequence_semaine) }),
        brushing_utilise: formData.brushing_utilise,
        lisseur_utilise: formData.lisseur_utilise,
        
        alcool_boit: formData.alcool_boit,
        type_dechet: formData.type_dechet,
        ordures_frequence_semaine: parseInt(formData.ordures_frequence_semaine),
        elimination_ordures: formData.elimination_ordures,
        tabac: formData.tabac,
        cigarettes: formData.cigarettes,
        ...(formData.alcool_boit || formData.tabac || formData.cigarettes ? { produits_stupéfiants_frequence_semaine: parseInt(formData.produits_stupéfiants_frequence_semaine) } : {})
      }

      const { error: insertError } = await supabase
        .from('responses')
        .insert({ user_id: user.id, answers })

      if (insertError) {
        if (insertError.code === '23505') {
          setError('Vous avez déjà répondu à cette enquête.')
        } else {
          throw insertError
        }
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError('Erreur lors de la soumission. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToStep = (step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-0">
        <LoadingSpinner message="Chargement du formulaire..." />
      </div>
    )
  }

  if (alreadyResponded) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-0">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Formulaire</h1>
        </div>
        <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
          <Badge type="success" message="Vous avez déjà répondu à cette enquête, merci !" />
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-0">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Formulaire</h1>
        </div>
        <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
          <Badge type="success" message="Merci ! Votre réponse a été enregistrée avec succès." />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0 mb-2">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Formulaire d'enquête</h1>
      </div>

      {error && (
        <div className="mb-4">
          <Badge type="error" message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center md:grid md:grid-cols-4 md:gap-2">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex flex-col items-start flex-1">
              <div 
                onClick={() => goToStep(index + 1)}
                className={`flex items-center gap-2 border-b-2 pb-1 mb-1 cursor-pointer ${
                    currentStep === index + 1
                      ? 'border-primary'
                      : currentStep > index + 1
                      ? 'border-green-500'
                      : 'border-text-secondary/20'
                  }`}>
                <button
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    currentStep === index + 1
                      ? 'bg-primary text-white'
                      : currentStep > index + 1
                      ? 'bg-green-500 text-white'
                      : 'bg-text-secondary/20 text-text-secondary'
                  }`}
                >
                  {currentStep > index + 1 ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </button>
                <span className={`hidden md:inline text-xs ${currentStep === index + 1 ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                  {title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1: Informations générales */}
        {currentStep === 1 && (
          <InformationsGenerales
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        )}

        {/* Étape 2: Transport & Consommation */}
        {currentStep === 2 && (
          <TransportConsommation
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        )}

        {/* Étape 3: Budget & Eau */}
        {currentStep === 3 && (
          <BudgetEau
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        )}

        {/* Étape 4: Alimentation */}
        {currentStep === 4 && (
          <Alimentation
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        )}

        {/* Étape 5: Outils numériques et cycle de vie du matériel */}
        {currentStep === 5 && (
          <Technologie
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        )}

        {/* Validation error badge for step 5 */}
        {currentStep === 5 && stepValidationErrors.length > 0 && (
          <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
            <Badge 
              type="error" 
              message={`Champs manquants dans les étapes : ${stepValidationErrors.map(step => stepTitles[step - 1]).join(', ')}`} 
              onDismiss={() => setStepValidationErrors([])} 
            />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="px-6 py-3 border border-text-secondary/20 rounded-md font-medium text-text-primary hover:bg-text-secondary/5 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className='hidden md:inline'>Précédent</span>
            </button>
          )}
          <div className="flex-1" />
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 flex items-center gap-2"
            >
              <span className='hidden md:inline'>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <LoadingSpinner message="Envoi..." className="h-6" />
              ) : (
                'Envoyer ma réponse'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default Formulaire
