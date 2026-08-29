import ExcelJS from 'exceljs'

// --- 1. Détection de type ---------------------------------------------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const NUMBER_RE = /^-?\d+(\.\d+)?$/
const RANGE_RE = /^(\d+)_(\d+)/ // ex: "18_22", "100000_200000", "31_45min"

// Ordre de référence de l'objet `answers` envoyé par Formulaire.jsx.
const ANSWER_FIELD_ORDER = [
  'date_naissance',
  'genre',
  'filiere',
  'annee_universitaire',
  'residence_principale',
  'loyer_mensuel',
  'source_financement',
  'tranche_age',
  'age_exact',
  'transport_principal',
  'autre_transport',
  'combine_transports',
  'duree_trajet',
  'depense_transport_jour',
  'difficultes_transport',
  'led_utilise',
  'eteint_lumieres_debranche',
  'coupures_frequentes',
  'impact_coupures',
  'budget_mensuel_total',
  'postes_depenses',
  'budget_couvre_besoins',
  'acces_eau_potable',
  'pratiques_economie_eau',
  'nombre_repas_jour',
  'lieu_repas_principaux',
  'source_approvisionnement_alimentaire',
  'energie_cuisson',
  'frequence_collation',
  'depense_alimentation_jour',
  'consommation_viande_poisson',
  'fruits_legumes_locaux_saison',
  'produits_plastique_usage_unique',
  'alimentation_equilibree',
  'gestion_restes_alimentaires',
  'impact_chaine_approvisionnement',
  'equipements_numeriques',
  'duree_utilisation_appareil',
  'recharge_appareils_plusieurs_fois_nuit',
  'reaction_panne_appareil',
  'elimination_equipements_electroniques',
  'ecoconception_numerique_suggestion',
  'nombre_tenues_semaine',
  'frequence_renouvellement_vetements',
  'origine_achat_vetements',
  'possede_fibres_naturelles_locales',
  'methode_lavage_vetements',
  'lessive_ecologique_utilisee',
  'sechage_exterieur',
  'repare_vetements',
  'devenir_vetements_usages',
  'produits_chimiques_utilises',
  'lit_etiquettes_produits',
  'connait_principes_chimie_verte',
  'procedes_locaux_durables',
  'favorable_ateliers_ecologiques',
  'contribution_formation_environnement',
  'types_dechets_produits',
  'utilise_contenants_reutilisables',
  'pratique_tri_selectif',
  'revend_bouteilles_metaux_collecteurs',
  'lieu_elimination_dechets',
  'connait_toxicite_combustion_plastiques',
  'poubelles_suffisantes_campus',
  'pret_a_participer_actions_environnementales',
  'perception_urgence_dechets',
  'suggestions_amelioration_campus',
]

const PRIORITY_ANSWER_FIELDS = [
  'date_naissance',
  'age_exact',
  'genre',
  'filiere',
  'annee_universitaire',
]

/**
 * Classe une valeur de réponse brute (celle stockée dans response.answers).
 * Retourne { kind, value }
 *   kind: 'empty' | 'number' | 'date' | 'boolean' | 'range' | 'multi' | 'text'
 *   value: valeur à afficher (texte lisible)
 */
function classifyAnswer(raw) {
  if (raw === null || raw === undefined || raw === '' || raw === '—') {
    return { kind: 'empty', value: null }
  }

  if (typeof raw === 'boolean') {
    return { kind: 'boolean', value: raw ? 'Oui' : 'Non' }
  }

  if (Array.isArray(raw)) {
    return {
      kind: 'multi',
      value: raw.length ? raw.join(', ') : 'Aucun',
    }
  }

  const str = String(raw).trim()

  if (NUMBER_RE.test(str)) {
    return { kind: 'number', value: Number(str) }
  }

  if (DATE_RE.test(str)) {
    return { kind: 'date', value: new Date(str) }
  }

  if (RANGE_RE.test(str)) {
    return { kind: 'range', value: str }
  }

  return { kind: 'text', value: str }
}

// --- 2. Aplatissement (objets imbriqués -> clé unique) ------------------

function flattenAnswers(value, prefix = '', out = {}) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
    Object.entries(value).forEach(([k, v]) => flattenAnswers(v, prefix ? `${prefix} > ${k}` : k, out))
    return out
  }
  out[prefix] = value
  return out
}

function getOrderedQuestionKeys(usersWithResponses) {
  const keysInResponses = new Set()

  usersWithResponses.forEach((user) => {
    Object.keys(flattenAnswers(user.__response.answers)).forEach((key) => {
      keysInResponses.add(key)
    })
  })

  const orderedKeys = [
    ...PRIORITY_ANSWER_FIELDS,
    ...ANSWER_FIELD_ORDER.filter(
      (key) => !PRIORITY_ANSWER_FIELDS.includes(key) && keysInResponses.has(key)
    ),
  ]

  const additionalKeys = [...keysInResponses]
    .filter((key) => !orderedKeys.includes(key))
    .sort()

  return [...orderedKeys, ...additionalKeys]
}

// --- 3. Feuille "large" : 1 ligne par répondant -------------------------

function buildWideSheet(workbook, usersWithResponses) {
  const worksheet = workbook.addWorksheet('Réponses (large)')

  const questionKeys = getOrderedQuestionKeys(usersWithResponses)

  const columns = [
    { header: 'Nom', key: 'nom', width: 18 },
    { header: 'Prénoms', key: 'prenom', width: 20 },
  ]

  questionKeys.forEach((q) => {
    columns.push({ header: q.replace(/_/g, ' '), key: q, width: 22 })
  })
  columns.splice(7, 0, { header: 'Email', key: 'email', width: 28 })

  worksheet.columns = columns
  worksheet.getRow(1).font = { bold: true }

  usersWithResponses.forEach((user) => {
    const flat = flattenAnswers(user.__response.answers)
    const row = { nom: user.nom || '', prenom: user.prenom || '', email: user.email || '' }

    questionKeys.forEach((q) => {
      const { kind, value } = classifyAnswer(flat[q])

      if (kind === 'empty') {
        row[q] = null
      } else if (kind === 'date') {
        row[q] = value // objet Date -> ExcelJS l'écrit comme une vraie date
      } else if (kind === 'number') {
        row[q] = value // nombre natif, pas une chaîne
      } else {
        row[q] = value // texte lisible (catégorie, intervalle brut, liste jointe)
      }

    })

    const addedRow = worksheet.addRow(row)

    // Format d'affichage des cellules numériques / dates
    questionKeys.forEach((q) => {
      const cell = addedRow.getCell(worksheet.getColumn(q).number)
      const { kind } = classifyAnswer(flat[q])
      if (kind === 'date') cell.numFmt = 'dd/mm/yyyy'
      if (kind === 'number') cell.numFmt = '0.##'
    })
  })

  return worksheet
}

// --- 4. Feuille "détail" (long / tidy) — pour tableaux croisés dynamiques ---

function buildLongSheet(workbook, usersWithResponses) {
  const worksheet = workbook.addWorksheet('Réponses (détail)')

  worksheet.columns = [
    { header: 'Nom', key: 'nom', width: 18 },
    { header: 'Prénoms', key: 'prenom', width: 20 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Question', key: 'question', width: 35 },
    { header: 'Réponse', key: 'reponse', width: 40 },
    { header: 'Type détecté', key: 'type', width: 14 },
  ]
  worksheet.getRow(1).font = { bold: true }

  usersWithResponses.forEach((user) => {
    const flat = flattenAnswers(user.__response.answers)

    Object.entries(flat).forEach(([q, raw]) => {
      const { kind, value } = classifyAnswer(raw)

      const row = worksheet.addRow({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        question: q.replace(/_/g, ' '),
        reponse: kind === 'empty' ? '—' : value,
        type: kind,
      })

      const reponseCell = row.getCell('reponse')
      if (kind === 'date') reponseCell.numFmt = 'dd/mm/yyyy'
      if (kind === 'number') reponseCell.numFmt = '0.##'
    })
  })

  return worksheet
}

// --- 5. Fonctions publiques ----------------------------------------------

export async function buildResultsWorkbook(usersWithResponsesRaw) {
  // usersWithResponsesRaw: [{ ...user, response }]
  const usersWithResponses = usersWithResponsesRaw.map((u) => ({ ...u, __response: u.response }))

  const workbook = new ExcelJS.Workbook()
  buildWideSheet(workbook, usersWithResponses)
  buildLongSheet(workbook, usersWithResponses)
  return workbook
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
