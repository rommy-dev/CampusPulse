import { useState, useEffect } from 'react'
import { FileText, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import Badge from '../components/Badge'

function Formulaire() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyResponded, setAlreadyResponded] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const [formData, setFormData] = useState({
    // Étape 1: Logement & Transport
    logement: '',
    autre_logement: '',
    transport: [],
    autre_transport: '',
    frequence_venue: '',
    frequence_depart: '',
    domicialisation_ville: '',
    domicialisation_distance_vontovorona: '',

    // Étape 2: Alimentation
    repas: {
      repas_maison: [],
      cantine: [],
      fast_food: [],
      repas_rue: []
    },
    autre_repas_maison: '',
    autre_repas_cantine: '',
    autre_repas_fast_food: '',
    autre_repas_repas_rue: '',
    gouters: [],
    autre_gouters: '',
    cafe_boit: false,
    cafe_frequence_jour: '',

    // Étape 3: Hygiène & Vêtements
    douche_quotidienne: false,
    douche_frequence: '',
    eau_bouillir: false,
    vetements_semaine: '',
    vetements_laver_repasser: '',
    brushing_utilise: false,
    lissage_utilise: false,

    // Étape 4: Technologie
    telephone_marque: '',
    recharge_telephone_jour: '',
    ecrans_tel_heures_jour: '',
    pc_possede: false,
    pc_nombre: '',
    pc_usage: [],
    autre_pc_usage: '',
    recharge_pc_frequence: '',
    ecrans_pc_heures_jour: '',
    tablette_possede: false,
    tablette_nombre: '',
    recharge_tablette_frequence: '',

    // Étape 5: Mode de vie
    alcool_boit: false,
    nuisance_sonore: false,
    ordures_quantite: ''
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

    // Étape 1: Logement & Transport
    if (!formData.logement) errors.logement = 'Ce champ est obligatoire'
    if (formData.logement === 'autre' && !formData.autre_logement) errors.autre_logement = 'Veuillez préciser'
    if (formData.transport.length === 0) errors.transport = 'Ce champ est obligatoire'
    if (formData.transport.includes('autre') && !formData.autre_transport) errors.autre_transport = 'Veuillez préciser'
    if (formData.frequence_venue === '' || formData.frequence_venue < 0 || formData.frequence_venue > 7) {
      errors.frequence_venue = 'Veuillez entrer un nombre entre 0 et 7'
    }
    if (formData.frequence_depart === '' || formData.frequence_depart < 0) {
      errors.frequence_depart = 'Veuillez entrer un nombre positif'
    }
    if (!formData.domicialisation_ville) errors.domicialisation_ville = 'Ce champ est obligatoire'
    if (formData.domicialisation_distance_vontovorona === '' || formData.domicialisation_distance_vontovorona < 0) {
      errors.domicialisation_distance_vontovorona = 'Veuillez entrer une distance valide'
    }

    // Étape 2: Alimentation
    if (Object.keys(formData.repas).length === 0) errors.repas = 'Ce champ est obligatoire'
    if (formData.gouters.length === 0) errors.gouters = 'Ce champ est obligatoire'
    if (formData.gouters.includes('autre') && !formData.autre_gouters) errors.autre_gouters = 'Veuillez préciser'
    if (formData.cafe_boit && (formData.cafe_frequence_jour === '' || formData.cafe_frequence_jour < 0)) {
      errors.cafe_frequence_jour = 'Veuillez entrer un nombre positif'
    }

    // Étape 3: Hygiène & Vêtements
    if (formData.douche_quotidienne && (formData.douche_frequence === '' || formData.douche_frequence < 0)) {
      errors.douche_frequence = 'Veuillez entrer un nombre positif'
    }
    if (formData.vetements_semaine === '' || formData.vetements_semaine < 0) {
      errors.vetements_semaine = 'Veuillez entrer un nombre positif'
    }
    if (formData.vetements_laver_repasser === '' || formData.vetements_laver_repasser < 0) {
      errors.vetements_laver_repasser = 'Veuillez entrer un nombre positif'
    }

    // Étape 4: Technologie
    if (!formData.telephone_marque) errors.telephone_marque = 'Ce champ est obligatoire'
    if (formData.recharge_telephone_jour === '' || formData.recharge_telephone_jour < 0) {
      errors.recharge_telephone_jour = 'Veuillez entrer un nombre positif'
    }
    if (formData.ecrans_tel_heures_jour === '' || formData.ecrans_tel_heures_jour < 0) {
      errors.ecrans_tel_heures_jour = 'Veuillez entrer un nombre positif'
    }
    if (formData.pc_possede) {
      if (formData.pc_nombre === '' || formData.pc_nombre < 0) errors.pc_nombre = 'Veuillez entrer un nombre positif'
      if (formData.pc_usage.length === 0) errors.pc_usage = 'Ce champ est obligatoire'
      if (formData.pc_usage.includes('autre') && !formData.autre_pc_usage) errors.autre_pc_usage = 'Veuillez préciser'
      if (formData.recharge_pc_frequence === '' || formData.recharge_pc_frequence < 0) {
        errors.recharge_pc_frequence = 'Veuillez entrer un nombre positif'
      }
      if (formData.ecrans_pc_heures_jour === '' || formData.ecrans_pc_heures_jour < 0) {
        errors.ecrans_pc_heures_jour = 'Veuillez entrer un nombre positif'
      }
    }
    if (formData.tablette_possede) {
      if (formData.tablette_nombre === '' || formData.tablette_nombre < 0) errors.tablette_nombre = 'Veuillez entrer un nombre positif'
      if (formData.recharge_tablette_frequence === '' || formData.recharge_tablette_frequence < 0) {
        errors.recharge_tablette_frequence = 'Veuillez entrer un nombre positif'
      }
    }

    // Étape 5: Mode de vie
    if (!formData.ordures_quantite) errors.ordures_quantite = 'Ce champ est obligatoire'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    setError(null)

    try {
      const answers = {
        logement: formData.logement === 'autre' ? formData.autre_logement : formData.logement,
        transport: formData.transport.map(t => t === 'autre' ? formData.autre_transport : t),
        frequence_venue: parseInt(formData.frequence_venue),
        frequence_depart: parseInt(formData.frequence_depart),
        domicialisation_ville: formData.domicialisation_ville,
        domicialisation_distance_vontovorona: parseFloat(formData.domicialisation_distance_vontovorona),
        repas: formData.repas,
        gouters: formData.gouters.map(g => g === 'autre' ? formData.autre_gouters : g),
        cafe_boit: formData.cafe_boit,
        ...(formData.cafe_boit && { cafe_frequence_jour: parseInt(formData.cafe_frequence_jour) }),
        douche_quotidienne: formData.douche_quotidienne,
        ...(formData.douche_quotidienne && { douche_frequence: parseInt(formData.douche_frequence) }),
        eau_bouillir: formData.eau_bouillir,
        vetements_semaine: parseInt(formData.vetements_semaine),
        vetements_laver_repasser: parseInt(formData.vetements_laver_repasser),
        brushing_utilise: formData.brushing_utilise,
        lissage_utilise: formData.lissage_utilise,
        telephone_marque: formData.telephone_marque,
        recharge_telephone_jour: parseInt(formData.recharge_telephone_jour),
        ecrans_tel_heures_jour: parseFloat(formData.ecrans_tel_heures_jour),
        pc_possede: formData.pc_possede,
        ...(formData.pc_possede && {
          pc_nombre: parseInt(formData.pc_nombre),
          pc_usage: formData.pc_usage.map(u => u === 'autre' ? formData.autre_pc_usage : u),
          recharge_pc_frequence: parseInt(formData.recharge_pc_frequence),
          ecrans_pc_heures_jour: parseFloat(formData.ecrans_pc_heures_jour)
        }),
        tablette_possede: formData.tablette_possede,
        ...(formData.tablette_possede && {
          tablette_nombre: parseInt(formData.tablette_nombre),
          recharge_tablette_frequence: parseInt(formData.recharge_tablette_frequence)
        }),
        alcool_boit: formData.alcool_boit,
        nuisance_sonore: formData.nuisance_sonore,
        ordures_quantite: formData.ordures_quantite
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

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleRepasChange = (type, subOption) => {
    setFormData(prev => {
      const repas = { ...prev.repas }
      if (!repas[type]) {
        repas[type] = []
      }
      if (repas[type].includes(subOption)) {
        repas[type] = repas[type].filter(item => item !== subOption)
        if (repas[type].length === 0) delete repas[type]
      } else {
        repas[type] = [...repas[type], subOption]
      }
      return { ...prev, repas }
    })
    if (validationErrors.repas) {
      setValidationErrors(prev => ({ ...prev, repas: null }))
    }
  }

  const handleRepasTypeToggle = (type) => {
    setFormData(prev => {
      const repas = { ...prev.repas }
      if (repas[type]) {
        delete repas[type]
      } else {
        repas[type] = []
      }
      return { ...prev, repas }
    })
    if (validationErrors.repas) {
      setValidationErrors(prev => ({ ...prev, repas: null }))
    }
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

  const stepTitles = [
    'Logement & Transport',
    'Alimentation',
    'Hygiène & Vêtements',
    'Technologie',
    'Mode de vie'
  ]

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
        <div className="flex items-center justify-between">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                onClick={() => goToStep(index + 1)}
                className={`flex items-center gap-2 border-b-2 pb-2 cursor-pointer ${
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
        {/* Étape 1: Logement & Transport */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Logement</h2>
              <div className="space-y-2">
                {[
                  { value: 'residence_universitaire', label: 'Résidence universitaire' },
                  { value: 'chez_parents', label: 'Chez les parents' },
                  { value: 'colocation', label: 'Colocation' },
                  { value: 'location_seul', label: 'Location seul(e)' },
                  { value: 'autre', label: 'Autre' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="logement"
                      value={option.value}
                      checked={formData.logement === option.value}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, logement: e.target.value }))
                        if (validationErrors.logement) setValidationErrors(prev => ({ ...prev, logement: null }))
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
              {validationErrors.logement && <p className="text-danger text-sm mt-2">{validationErrors.logement}</p>}
              {formData.logement === 'autre' && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Précisez votre type de logement"
                    value={formData.autre_logement}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, autre_logement: e.target.value }))
                      if (validationErrors.autre_logement) setValidationErrors(prev => ({ ...prev, autre_logement: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.autre_logement && <p className="text-danger text-sm mt-1">{validationErrors.autre_logement}</p>}
                </div>
              )}
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Transport</h2>
              <p className="text-text-secondary text-sm mb-3">Choisissez tous les modes de transport que vous utilisez</p>
              <div className="space-y-2">
                {[
                  { value: 'pied', label: 'À pied' },
                  { value: 'velo', label: 'Vélo' },
                  { value: 'moto', label: 'Moto' },
                  { value: 'voiture', label: 'Voiture' },
                  { value: 'transport_commun', label: 'Transport en commun' },
                  { value: 'autre', label: 'Autre' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.transport.includes(option.value)}
                      onChange={() => handleCheckboxChange('transport', option.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
              {validationErrors.transport && <p className="text-danger text-sm mt-2">{validationErrors.transport}</p>}
              {formData.transport.includes('autre') && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Précisez votre mode de transport"
                    value={formData.autre_transport}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, autre_transport: e.target.value }))
                      if (validationErrors.autre_transport) setValidationErrors(prev => ({ ...prev, autre_transport: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.autre_transport && <p className="text-danger text-sm mt-1">{validationErrors.autre_transport}</p>}
                </div>
              )}
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Fréquence de venue sur le campus</h2>
              <div>
                <label className="block text-text-secondary mb-2">Nombre de jours par semaine</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={formData.frequence_venue}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, frequence_venue: e.target.value }))
                    if (validationErrors.frequence_venue) setValidationErrors(prev => ({ ...prev, frequence_venue: null }))
                  }}
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.frequence_venue && <p className="text-danger text-sm mt-1">{validationErrors.frequence_venue}</p>}
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Fréquence de déplacement</h2>
              <div>
                <label className="block text-text-secondary mb-2">Nombre d'allers-retours par semaine</label>
                <input
                  type="number"
                  min="0"
                  value={formData.frequence_depart}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, frequence_depart: e.target.value }))
                    if (validationErrors.frequence_depart) setValidationErrors(prev => ({ ...prev, frequence_depart: null }))
                  }}
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.frequence_depart && <p className="text-danger text-sm mt-1">{validationErrors.frequence_depart}</p>}
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Domicialisation</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary mb-2">Ville / Quartier</label>
                  <input
                    type="text"
                    value={formData.domicialisation_ville}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, domicialisation_ville: e.target.value }))
                      if (validationErrors.domicialisation_ville) setValidationErrors(prev => ({ ...prev, domicialisation_ville: null }))
                    }}
                    placeholder="Ex: Antanimena"
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.domicialisation_ville && <p className="text-danger text-sm mt-1">{validationErrors.domicialisation_ville}</p>}
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">Distance de Vontovorona (en km)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.domicialisation_distance_vontovorona}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, domicialisation_distance_vontovorona: e.target.value }))
                      if (validationErrors.domicialisation_distance_vontovorona) setValidationErrors(prev => ({ ...prev, domicialisation_distance_vontovorona: null }))
                    }}
                    placeholder="Ex: 12.5"
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.domicialisation_distance_vontovorona && <p className="text-danger text-sm mt-1">{validationErrors.domicialisation_distance_vontovorona}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 2: Alimentation */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Repas</h2>
              <p className="text-text-secondary text-sm mb-4">Cochez les types de repas que vous consommez, puis précisez les options</p>
              
              <div className="space-y-4">
                {[
                  { key: 'repas_maison', label: 'Repas à la maison', options: ['riz', 'legumes', 'viande', 'poisson', 'legumineuses', 'feculents', 'autre'] },
                  { key: 'cantine', label: 'Cantine', options: ['menu_du_jour', 'sandwich', 'salade', 'plat_rapide', 'autre'] },
                  { key: 'fast_food', label: 'Fast food', options: ['burger', 'pizza', 'frites', 'brochettes_grillades', 'autre'] },
                  { key: 'repas_rue', label: 'Repas de rue', options: ['mofo_gasy', 'beignets', 'brochettes_rue', 'snacks_locaux', 'autre'] }
                ].map(type => (
                  <div key={type.key} className="border border-text-secondary/10 rounded-md p-3">
                    <label className="flex items-center gap-3 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={!!formData.repas[type.key]}
                        onChange={() => handleRepasTypeToggle(type.key)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-text-primary font-medium">{type.label}</span>
                    </label>
                    {formData.repas[type.key] && (
                      <div className="ml-7 space-y-2">
                        {type.options.map(option => (
                          <label key={option} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.repas[type.key]?.includes(option)}
                              onChange={() => handleRepasChange(type.key, option)}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-text-primary text-sm capitalize">{option.replace(/_/g, ' ')}</span>
                          </label>
                        ))}
                        {type.key === 'repas_maison' && formData.repas[type.key]?.includes('autre') && (
                          <input
                            type="text"
                            placeholder="Précisez"
                            value={formData.autre_repas_maison}
                            onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_maison: e.target.value }))}
                            className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
                        {type.key === 'cantine' && formData.repas[type.key]?.includes('autre') && (
                          <input
                            type="text"
                            placeholder="Précisez"
                            value={formData.autre_repas_cantine}
                            onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_cantine: e.target.value }))}
                            className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
                        {type.key === 'fast_food' && formData.repas[type.key]?.includes('autre') && (
                          <input
                            type="text"
                            placeholder="Précisez"
                            value={formData.autre_repas_fast_food}
                            onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_fast_food: e.target.value }))}
                            className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
                        {type.key === 'repas_rue' && formData.repas[type.key]?.includes('autre') && (
                          <input
                            type="text"
                            placeholder="Précisez"
                            value={formData.autre_repas_repas_rue}
                            onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_repas_rue: e.target.value }))}
                            className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.repas.saute_repas}
                    onChange={() => handleRepasTypeToggle('saute_repas')}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary font-medium">Je saute parfois des repas</span>
                </label>
              </div>
              {validationErrors.repas && <p className="text-danger text-sm mt-2">{validationErrors.repas}</p>}
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Goûters</h2>
              <p className="text-text-secondary text-sm mb-3">Choisissez toutes les options qui s'appliquent</p>
              <div className="space-y-2">
                {[
                  { value: 'fruits', label: 'Fruits' },
                  { value: 'biscuits_sucres', label: 'Biscuits sucrés' },
                  { value: 'snacks_sales', label: 'Snacks salés' },
                  { value: 'rien', label: 'Je ne prends pas de goûter' },
                  { value: 'autre', label: 'Autre' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.gouters.includes(option.value)}
                      onChange={() => handleCheckboxChange('gouters', option.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
              {validationErrors.gouters && <p className="text-danger text-sm mt-2">{validationErrors.gouters}</p>}
              {formData.gouters.includes('autre') && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Précisez votre goûter"
                    value={formData.autre_gouters}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, autre_gouters: e.target.value }))
                      if (validationErrors.autre_gouters) setValidationErrors(prev => ({ ...prev, autre_gouters: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.autre_gouters && <p className="text-danger text-sm mt-1">{validationErrors.autre_gouters}</p>}
                </div>
              )}
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Café</h2>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.cafe_boit}
                  onChange={(e) => setFormData(prev => ({ ...prev, cafe_boit: e.target.checked }))}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Je bois du café</span>
              </label>
              {formData.cafe_boit && (
                <div className="ml-7">
                  <label className="block text-text-secondary mb-2">Combien de fois par jour ?</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cafe_frequence_jour}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, cafe_frequence_jour: e.target.value }))
                      if (validationErrors.cafe_frequence_jour) setValidationErrors(prev => ({ ...prev, cafe_frequence_jour: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.cafe_frequence_jour && <p className="text-danger text-sm mt-1">{validationErrors.cafe_frequence_jour}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Étape 3: Hygiène & Vêtements */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Hygiène</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.douche_quotidienne}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, douche_quotidienne: e.target.checked }))
                      if (validationErrors.douche_frequence) setValidationErrors(prev => ({ ...prev, douche_frequence: null }))
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">Je prends une douche quotidienne</span>
                </label>
                {formData.douche_quotidienne && (
                  <div className="ml-7">
                    <label className="block text-text-secondary mb-2">Nombre de douches par semaine</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.douche_frequence}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, douche_frequence: e.target.value }))
                        if (validationErrors.douche_frequence) setValidationErrors(prev => ({ ...prev, douche_frequence: null }))
                      }}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {validationErrors.douche_frequence && <p className="text-danger text-sm mt-1">{validationErrors.douche_frequence}</p>}
                  </div>
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.eau_bouillir}
                    onChange={(e) => setFormData(prev => ({ ...prev, eau_bouillir: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">Je fais bouillir l'eau pour me laver</span>
                </label>
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Vêtements</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary mb-2">Estimation du nombre de tenues différentes utilisées par semaine</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.vetements_semaine}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, vetements_semaine: e.target.value }))
                      if (validationErrors.vetements_semaine) setValidationErrors(prev => ({ ...prev, vetements_semaine: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.vetements_semaine && <p className="text-danger text-sm mt-1">{validationErrors.vetements_semaine}</p>}
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">Nombre de tenues à laver ou à repasser par semaine</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.vetements_laver_repasser}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, vetements_laver_repasser: e.target.value }))
                      if (validationErrors.vetements_laver_repasser) setValidationErrors(prev => ({ ...prev, vetements_laver_repasser: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.vetements_laver_repasser && <p className="text-danger text-sm mt-1">{validationErrors.vetements_laver_repasser}</p>}
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Soins capillaires</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.brushing_utilise}
                    onChange={(e) => setFormData(prev => ({ ...prev, brushing_utilise: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">J'utilise un brushing</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.lissage_utilise}
                    onChange={(e) => setFormData(prev => ({ ...prev, lissage_utilise: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">J'utilise un lissage</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Étape 4: Technologie */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Téléphone</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary mb-2">Marque de votre téléphone</label>
                  <input
                    type="text"
                    value={formData.telephone_marque}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, telephone_marque: e.target.value }))
                      if (validationErrors.telephone_marque) setValidationErrors(prev => ({ ...prev, telephone_marque: null }))
                    }}
                    placeholder="Ex: Samsung A14"
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.telephone_marque && <p className="text-danger text-sm mt-1">{validationErrors.telephone_marque}</p>}
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">Nombre de recharges par jour</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.recharge_telephone_jour}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, recharge_telephone_jour: e.target.value }))
                      if (validationErrors.recharge_telephone_jour) setValidationErrors(prev => ({ ...prev, recharge_telephone_jour: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.recharge_telephone_jour && <p className="text-danger text-sm mt-1">{validationErrors.recharge_telephone_jour}</p>}
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">Nombre d'heures d'écran par jour</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.ecrans_tel_heures_jour}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, ecrans_tel_heures_jour: e.target.value }))
                      if (validationErrors.ecrans_tel_heures_jour) setValidationErrors(prev => ({ ...prev, ecrans_tel_heures_jour: null }))
                    }}
                    placeholder="Ex: 4.5"
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.ecrans_tel_heures_jour && <p className="text-danger text-sm mt-1">{validationErrors.ecrans_tel_heures_jour}</p>}
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Ordinateur</h2>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.pc_possede}
                  onChange={(e) => setFormData(prev => ({ ...prev, pc_possede: e.target.checked }))}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Je possède un PC</span>
              </label>
              {formData.pc_possede && (
                <div className="ml-7 space-y-4">
                  <div>
                    <label className="block text-text-secondary mb-2">Nombre de PC</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pc_nombre}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, pc_nombre: e.target.value }))
                        if (validationErrors.pc_nombre) setValidationErrors(prev => ({ ...prev, pc_nombre: null }))
                      }}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {validationErrors.pc_nombre && <p className="text-danger text-sm mt-1">{validationErrors.pc_nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Usage (choisissez toutes les options)</label>
                    <div className="space-y-2">
                      {[
                        { value: 'etudes', label: 'Études' },
                        { value: 'loisir_jeux', label: 'Loisir / Jeux' },
                        { value: 'travail', label: 'Travail' },
                        { value: 'reseaux_sociaux', label: 'Réseaux sociaux' },
                        { value: 'autre', label: 'Autre' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.pc_usage.includes(option.value)}
                            onChange={() => handleCheckboxChange('pc_usage', option.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-text-primary">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {validationErrors.pc_usage && <p className="text-danger text-sm mt-2">{validationErrors.pc_usage}</p>}
                    {formData.pc_usage.includes('autre') && (
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Précisez l'usage"
                          value={formData.autre_pc_usage}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, autre_pc_usage: e.target.value }))
                            if (validationErrors.autre_pc_usage) setValidationErrors(prev => ({ ...prev, autre_pc_usage: null }))
                          }}
                          className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {validationErrors.autre_pc_usage && <p className="text-danger text-sm mt-1">{validationErrors.autre_pc_usage}</p>}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Fréquence de recharge par jour</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.recharge_pc_frequence}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, recharge_pc_frequence: e.target.value }))
                        if (validationErrors.recharge_pc_frequence) setValidationErrors(prev => ({ ...prev, recharge_pc_frequence: null }))
                      }}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {validationErrors.recharge_pc_frequence && <p className="text-danger text-sm mt-1">{validationErrors.recharge_pc_frequence}</p>}
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Nombre d'heures d'écran par jour</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.ecrans_pc_heures_jour}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, ecrans_pc_heures_jour: e.target.value }))
                        if (validationErrors.ecrans_pc_heures_jour) setValidationErrors(prev => ({ ...prev, ecrans_pc_heures_jour: null }))
                      }}
                      placeholder="Ex: 6"
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {validationErrors.ecrans_pc_heures_jour && <p className="text-danger text-sm mt-1">{validationErrors.ecrans_pc_heures_jour}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Tablette</h2>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.tablette_possede}
                  onChange={(e) => setFormData(prev => ({ ...prev, tablette_possede: e.target.checked }))}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Je possède une tablette</span>
              </label>
              {formData.tablette_possede && (
                <div className="ml-7 space-y-4">
                  <div>
                    <label className="block text-text-secondary mb-2">Nombre de tablettes</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tablette_nombre}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, tablette_nombre: e.target.value }))
                        if (validationErrors.tablette_nombre) setValidationErrors(prev => ({ ...prev, tablette_nombre: null }))
                      }}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {validationErrors.tablette_nombre && <p className="text-danger text-sm mt-1">{validationErrors.tablette_nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Fréquence de recharge par jour</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.recharge_tablette_frequence}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, recharge_tablette_frequence: e.target.value }))
                        if (validationErrors.recharge_tablette_frequence) setValidationErrors(prev => ({ ...prev, recharge_tablette_frequence: null }))
                      }}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {validationErrors.recharge_tablette_frequence && <p className="text-danger text-sm mt-1">{validationErrors.recharge_tablette_frequence}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Étape 5: Mode de vie */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Consommation</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.alcool_boit}
                    onChange={(e) => setFormData(prev => ({ ...prev, alcool_boit: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">Je bois de l'alcool</span>
                </label>
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Environnement</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.nuisance_sonore}
                  onChange={(e) => setFormData(prev => ({ ...prev, nuisance_sonore: e.target.checked }))}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Présence de nuisance sonore</span>
              </label>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Gestion des déchets</h2>
              <p className="text-text-secondary text-sm mb-3">Quantité d'ordures produite par semaine</p>
              <div className="space-y-2">
                {[
                  { value: 'moins_petit_sac', label: 'Moins d\'un petit sac' },
                  { value: 'un_sac_moyen', label: 'Un sac moyen' },
                  { value: 'deux_sacs_ou_plus', label: 'Deux sacs ou plus' },
                  { value: 'ne_sait_pas', label: 'Je ne sais pas' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="ordures"
                      value={option.value}
                      checked={formData.ordures_quantite === option.value}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, ordures_quantite: e.target.value }))
                        if (validationErrors.ordures_quantite) setValidationErrors(prev => ({ ...prev, ordures_quantite: null }))
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
              {validationErrors.ordures_quantite && <p className="text-danger text-sm mt-2">{validationErrors.ordures_quantite}</p>}
            </div>
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
