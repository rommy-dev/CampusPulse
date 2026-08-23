import { useState, useEffect } from 'react'
import { FileText, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import Badge from '../components/Badge'
import LogementTransport from '../components/form/LogementTransport'
import Alimentation from '../components/form/Alimentation'
import HygieneVetements from '../components/form/HygieneVetements'
import Technologie from '../components/form/Technologie'
import ModeDeVie from '../components/form/ModeDeVie'

function Formulaire() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyResponded, setAlreadyResponded] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [stepValidationErrors, setStepValidationErrors] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const stepTitles = [
    'Logement & Transport',
    'Alimentation',
    'Hygiène & Vêtements',
    'Technologie',
    'Mode de vie'
  ]

  const [formData, setFormData] = useState({
    // Étape 1: Logement & Transport
    habite_cur_vontovorona: false,
    type_logement_cur: '',
    nombre_coloc: '',
    type_location: '',
    nombre_personnes_location: '',
    region: '',
    district: '',
    commune: '',
    ville: '',
    quartier: '',
    venant_antananarivo: false,
    famille_antananarivo: false,
    habite_chez_famille_ville: false,
    famille_district: '',
    famille_commune: '',
    famille_ville: '',
    famille_quartier: '',
    transport: [],
    autre_transport: '',
    jours_cur_semaine: '',
    jours_maison_semaine: '',
    allers_retours_semaine: '',
    frequence_retour_origine: '',

    // Étape 2: Alimentation
    alimentation: {
      saute_repas: false,
      moyen_cuisson: [],
      cuisson_heures_jour: '',
      cuisson_fois_jour: '',
      cuisson_autre_precision: '',
      petit_dejeuner: {
        mode: [],
        aliments: {
          boissons: [],
          feculents: [],
          produits_locaux: [],
          proteines: [],
          fruits: [],
          autre: ''
        },
        riz_frequence_jour: null
      },
      dejeuner: {
        mode: [],
        aliments: {
          feculents: [],
          legumes: [],
          proteines_animales: [],
          proteines_vegetales: [],
          fruits: [],
          autre: ''
        },
        riz_frequence_jour: null
      },
      diner: {
        mode: [],
        aliments: {
          feculents: [],
          legumes: [],
          proteines_animales: [],
          proteines_vegetales: [],
          fruits: [],
          autre: ''
        },
        riz_frequence_jour: null
      },
      gouter: {
        mode: [],
        aliments: {
          boissons: [],
          fruits: [],
          produits_cereaux: [],
          snacks: [],
          autre: ''
        },
        pas_de_gouter: false
      },
      boissons: {
        eau: { selectionne: false, frequence_jour: null, litres_jour: null },
        eau_gazeuse: { selectionne: false, frequence_jour: null, litres_jour: null },
        the: { selectionne: false, frequence_jour: null },
        cafe: { selectionne: false, frequence_jour: null },
        cacao: { selectionne: false, frequence_jour: null },
        lait: { selectionne: false, frequence_jour: null },
        jus_fruits: { selectionne: false, frequence_jour: null },
        jus_legumes: { selectionne: false, frequence_jour: null },
        smoothie: { selectionne: false, frequence_jour: null },
        infusion: { selectionne: false, frequence_jour: null },
        boisson_gazeuse: { selectionne: false, frequence_jour: null },
        boisson_energetique: { selectionne: false, frequence_jour: null },
        boisson_sucree: { selectionne: false, frequence_jour: null },
        boisson_sans_sucre: { selectionne: false, frequence_jour: null },
        autre: { selectionne: false, frequence_jour: null, precision: '' }
      }
    },

    // Étape 3: Hygiène & Vêtements
    type_hygiene: '',
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
    lumiere_heures_jour: '',

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

    // Étape 1: Logement & Transport
    // Logement
    if (formData.habite_cur_vontovorona && !formData.type_logement_cur) {
      errors.type_logement_cur = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (formData.habite_cur_vontovorona && formData.type_logement_cur === 'colocation' && (formData.nombre_coloc === '' || formData.nombre_coloc < 0)) {
      errors.nombre_coloc = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(1)
    }
    if (formData.habite_cur_vontovorona && formData.type_logement_cur === 'location' && !formData.type_location) {
      errors.type_location = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (formData.habite_cur_vontovorona && formData.type_logement_cur === 'location' && formData.type_location === 'plusieurs' && (formData.nombre_personnes_location === '' || formData.nombre_personnes_location < 0)) {
      errors.nombre_personnes_location = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(1)
    }

    // Origine
    if (!formData.region) {
      errors.region = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (!formData.district) {
      errors.district = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (!formData.commune) {
      errors.commune = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (!formData.ville) {
      errors.ville = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (!formData.quartier) {
      errors.quartier = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (formData.venant_antananarivo === undefined) {
      errors.venant_antananarivo = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (formData.venant_antananarivo === false && formData.famille_antananarivo === undefined) {
      errors.famille_antananarivo = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (formData.venant_antananarivo === false && formData.famille_antananarivo === true && formData.habite_chez_famille_ville === undefined) {
      errors.habite_chez_famille_ville = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (formData.venant_antananarivo === false && formData.famille_antananarivo === true && formData.habite_chez_famille_ville === true && !formData.famille_quartier) {
      errors.famille_habite = 'Veuillez remplir les informations sur le lieu de résidence de votre famille'
      stepsWithErrors.add(1)
    }

    // Transport
    if (formData.transport.length === 0) {
      errors.transport = 'Ce champ est obligatoire'
      stepsWithErrors.add(1)
    }
    if (formData.transport.includes('autre') && !formData.autre_transport) {
      errors.autre_transport = 'Veuillez préciser'
      stepsWithErrors.add(1)
    }
    if (formData.jours_cur_semaine === '' || formData.jours_cur_semaine < 0 || formData.jours_cur_semaine > 7) {
      errors.jours_cur_semaine = 'Veuillez entrer un nombre entre 0 et 7'
      stepsWithErrors.add(1)
    }
    if (formData.jours_maison_semaine === '' || formData.jours_maison_semaine < 0 || formData.jours_maison_semaine > 7) {
      errors.jours_maison_semaine = 'Veuillez entrer un nombre entre 0 et 7'
      stepsWithErrors.add(1)
    }
    if (formData.allers_retours_semaine === '' || formData.allers_retours_semaine < 0) {
      errors.allers_retours_semaine = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(1)
    }
    if (formData.frequence_retour_origine === '' || formData.frequence_retour_origine < 0) {
      errors.frequence_retour_origine = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(1)
    }

    // Étape 2: Alimentation
    // Skip validation if alimentation is not initialized yet
    if (!formData.alimentation) {
      errors.alimentation = 'Veuillez remplir les informations alimentaires'
      stepsWithErrors.add(2)
    } else {
      // Validate cooking method
      if (!formData.alimentation.moyen_cuisson || formData.alimentation.moyen_cuisson.length === 0) {
        errors.moyen_cuisson = 'Veuillez sélectionner au moins un moyen de cuisson'
        stepsWithErrors.add(2)
      }

      // Validate conditional cooking fields
      const hasGazOrResistance = formData.alimentation.moyen_cuisson?.includes('gaz') || formData.alimentation.moyen_cuisson?.includes('resistance')
      if (hasGazOrResistance && (formData.alimentation.cuisson_heures_jour === '' || formData.alimentation.cuisson_heures_jour < 0)) {
        errors.cuisson_heures_jour = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(2)
      }

      const hasCharbonOrBois = formData.alimentation.moyen_cuisson?.includes('charbon') || formData.alimentation.moyen_cuisson?.includes('bois')
      if (hasCharbonOrBois && (formData.alimentation.cuisson_fois_jour === '' || formData.alimentation.cuisson_fois_jour < 0)) {
        errors.cuisson_fois_jour = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(2)
      }

      if (formData.alimentation.moyen_cuisson?.includes('autre') && !formData.alimentation.cuisson_autre_precision) {
        errors.cuisson_autre_precision = 'Veuillez préciser le moyen de cuisson'
        stepsWithErrors.add(2)
      }

      // Validate at least one meal has mode selected
      const hasMealMode = ['petit_dejeuner', 'dejeuner', 'diner', 'gouter'].some(
        meal => formData.alimentation[meal]?.mode && formData.alimentation[meal].mode.length > 0
      )
      if (!hasMealMode) {
        errors.alimentation_mode = 'Veuillez sélectionner au moins un mode de repas'
        stepsWithErrors.add(2)
      }

      // Validate rice frequency when rice is selected and cooking at home
      ['petit_dejeuner', 'dejeuner', 'diner'].forEach(meal => {
        const mealData = formData.alimentation[meal]
        if (mealData && mealData.aliments) {
          const hasRiz = mealData.aliments.feculents?.includes('riz')
          const cooksAtHome = mealData.mode?.includes('cuisine_chez_moi')
          if (hasRiz && cooksAtHome) {
            if (!mealData.riz_frequence_jour || mealData.riz_frequence_jour < 0) {
              errors[`${meal}_riz_frequence`] = 'Veuillez entrer un nombre positif'
              stepsWithErrors.add(2)
            }
          }
        }
      })

      // Validate beverage frequencies when selected
      if (formData.alimentation.boissons) {
        Object.entries(formData.alimentation.boissons).forEach(([boissonKey, boissonData]) => {
          if (boissonData && boissonData.selectionne) {
            if (!boissonData.frequence_jour || boissonData.frequence_jour < 0) {
              errors[`boisson_${boissonKey}_frequence`] = 'Veuillez entrer un nombre positif'
              stepsWithErrors.add(2)
            }
            // Validate water quantity for water types
            if ((boissonKey === 'eau' || boissonKey === 'eau_gazeuse') && 
                (!boissonData.litres_jour || boissonData.litres_jour < 0)) {
              errors[`boisson_${boissonKey}_litres`] = 'Veuillez entrer une quantité positive'
              stepsWithErrors.add(2)
            }
            // Validate autre precision
            if (boissonKey === 'autre' && !boissonData.precision) {
              errors.boisson_autre_precision = 'Veuillez préciser la boisson'
              stepsWithErrors.add(2)
            }
          }
        })
      }
    }

    // Étape 3: Hygiène & Vêtements
    if (!formData.type_hygiene) {
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

    // Étape 4: Technologie
    if (!formData.telephone_marque) {
      errors.telephone_marque = 'Ce champ est obligatoire'
      stepsWithErrors.add(4)
    }
    if (formData.recharge_telephone_jour === '' || formData.recharge_telephone_jour < 0) {
      errors.recharge_telephone_jour = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(4)
    }
    if (formData.ecrans_tel_heures_jour === '' || formData.ecrans_tel_heures_jour < 0) {
      errors.ecrans_tel_heures_jour = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(4)
    }
    if (formData.pc_possede) {
      if (formData.pc_nombre === '' || formData.pc_nombre < 0) {
        errors.pc_nombre = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(4)
      }
      if (formData.pc_usage.length === 0) {
        errors.pc_usage = 'Ce champ est obligatoire'
        stepsWithErrors.add(4)
      }
      if (formData.pc_usage.includes('autre') && !formData.autre_pc_usage) {
        errors.autre_pc_usage = 'Veuillez préciser'
        stepsWithErrors.add(4)
      }
      if (formData.recharge_pc_frequence === '' || formData.recharge_pc_frequence < 0) {
        errors.recharge_pc_frequence = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(4)
      }
      if (formData.ecrans_pc_heures_jour === '' || formData.ecrans_pc_heures_jour < 0) {
        errors.ecrans_pc_heures_jour = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(4)
      }
    }
    if (formData.tablette_possede) {
      if (formData.tablette_nombre === '' || formData.tablette_nombre < 0) {
        errors.tablette_nombre = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(4)
      }
      if (formData.recharge_tablette_frequence === '' || formData.recharge_tablette_frequence < 0) {
        errors.recharge_tablette_frequence = 'Veuillez entrer un nombre positif'
        stepsWithErrors.add(4)
      }
    }
    if (formData.lumiere_heures_jour === '' || formData.lumiere_heures_jour < 0) {
      errors.lumiere_heures_jour = 'Veuillez entrer un nombre positif'
      stepsWithErrors.add(4)
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
      const answers = {
        habite_cur_vontovorona: formData.habite_cur_vontovorona,
        ...(formData.habite_cur_vontovorona && {
          type_logement_cur: formData.type_logement_cur,
          ...(formData.type_logement_cur === 'colocation' && { nombre_coloc: parseInt(formData.nombre_coloc) }),
          ...(formData.type_logement_cur === 'location' && {
            type_location: formData.type_location,
            ...(formData.type_location === 'plusieurs' && { nombre_personnes_location: parseInt(formData.nombre_personnes_location) })
          })
        }),
        region: formData.region,
        district: formData.district,
        commune: formData.commune,
        ville: formData.ville,
        quartier: formData.quartier,
        venant_antananarivo: formData.venant_antananarivo,
        ...(formData.venant_antananarivo === false && {
          famille_antananarivo: formData.famille_antananarivo,
          ...(formData.famille_antananarivo === true && { habite_chez_famille_ville: formData.habite_chez_famille_ville }),
          ...(formData.famille_antananarivo === true && formData.habite_chez_famille_ville === true && {
            famille_district: formData.famille_district,
            famille_commune: formData.famille_commune,
            famille_ville: formData.famille_ville,
            famille_quartier: formData.famille_quartier
          })
        }),
        transport: formData.transport.map(t => t === 'autre' ? formData.autre_transport : t),
        jours_cur_semaine: parseInt(formData.jours_cur_semaine),
        jours_maison_semaine: parseInt(formData.jours_maison_semaine),
        allers_retours_semaine: parseInt(formData.allers_retours_semaine),
        frequence_retour_origine: parseInt(formData.frequence_retour_origine),
        alimentation: formData.alimentation ? {
          ...formData.alimentation,
          moyen_cuisson: formData.alimentation.moyen_cuisson,
          ...(formData.alimentation.cuisson_heures_jour !== '' && { cuisson_heures_jour: parseFloat(formData.alimentation.cuisson_heures_jour) }),
          ...(formData.alimentation.cuisson_fois_jour !== '' && { cuisson_fois_jour: parseInt(formData.alimentation.cuisson_fois_jour) }),
          ...(formData.alimentation.cuisson_autre_precision && { cuisson_autre_precision: formData.alimentation.cuisson_autre_precision }),
          // Convert numeric fields
          petit_dejeuner: {
            ...formData.alimentation.petit_dejeuner,
            riz_frequence_jour: formData.alimentation.petit_dejeuner?.riz_frequence_jour ?
              parseInt(formData.alimentation.petit_dejeuner.riz_frequence_jour) : null
          },
          dejeuner: {
            ...formData.alimentation.dejeuner,
            riz_frequence_jour: formData.alimentation.dejeuner?.riz_frequence_jour ?
              parseInt(formData.alimentation.dejeuner.riz_frequence_jour) : null
          },
          diner: {
            ...formData.alimentation.diner,
            riz_frequence_jour: formData.alimentation.diner?.riz_frequence_jour ?
              parseInt(formData.alimentation.diner.riz_frequence_jour) : null
          },
          boissons: Object.fromEntries(
            Object.entries(formData.alimentation.boissons).map(([key, value]) => [
              key,
              {
                ...value,
                frequence_jour: value.frequence_jour ? parseInt(value.frequence_jour) : null,
                litres_jour: value.litres_jour ? parseFloat(value.litres_jour) : null
              }
            ])
          )
        } : null,
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
        lumiere_heures_jour: parseFloat(formData.lumiere_heures_jour),
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
          <LogementTransport 
            formData={formData} 
            setFormData={setFormData} 
            validationErrors={validationErrors} 
            setValidationErrors={setValidationErrors} 
          />
        )}

        {/* Étape 2: Alimentation */}
        {currentStep === 2 && (
          <Alimentation 
            formData={formData} 
            setFormData={setFormData} 
            validationErrors={validationErrors} 
            setValidationErrors={setValidationErrors} 
          />
        )}

        {/* Étape 3: Hygiène & Vêtements */}
        {currentStep === 3 && (
          <HygieneVetements 
            formData={formData} 
            setFormData={setFormData} 
            validationErrors={validationErrors} 
            setValidationErrors={setValidationErrors} 
          />
        )}

        {/* Étape 4: Technologie */}
        {currentStep === 4 && (
          <Technologie 
            formData={formData} 
            setFormData={setFormData} 
            validationErrors={validationErrors} 
            setValidationErrors={setValidationErrors} 
          />
        )}

        {/* Étape 5: Mode de vie */}
        {currentStep === 5 && (
          <ModeDeVie 
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
