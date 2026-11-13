// Comptages par question, au même format que la fonction SQL get_survey_stats() :
// { n, counts: { cle: { valeur: nombre } } }.
// Sert aux données d'illustration (DEMO_RESPONSES) quand la base est vide ou inaccessible ;
// les vraies réponses ne quittent jamais le serveur.
export function aggregateAnswers(rows) {
  const counts = {}
  const add = (key, value) => {
    if (value === null || value === undefined || value === '') return
    const bucket = (counts[key] ||= {})
    const label = String(value)
    bucket[label] = (bucket[label] || 0) + 1
  }

  rows.forEach(({ answers = {} }) => {
    Object.entries(answers).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((item) => add(key, item))
      else add(key, value)
    })
  })

  return { n: rows.length, counts }
}
