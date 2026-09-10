/**
 * Petit utilitaire de cache client basé sur localStorage, avec notion de péremption (TTL).
 *
 * - Ne stocke que des données sérialisables en JSON.
 * - Résiste aux environnements sans localStorage (navigation privée stricte, quota dépassé, SSR).
 * - Ne contient aucune donnée sensible : à réserver aux données publiques / non confidentielles.
 */

function isStorageAvailable() {
  try {
    const testKey = '__cache_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

const storageOk = typeof window !== 'undefined' && isStorageAvailable()

/**
 * Récupère une valeur en cache.
 * @param {string} key
 * @param {{ staleAfterMs?: number }} [options] - Au-delà de ce délai, isStale=true (mais la valeur est quand même renvoyée).
 * @returns {{ value: any, isStale: boolean } | null}
 */
export function getCached(key, { staleAfterMs = 0 } = {}) {
  if (!storageOk) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const { value, savedAt } = JSON.parse(raw)
    const age = Date.now() - savedAt
    return { value, isStale: staleAfterMs > 0 && age > staleAfterMs }
  } catch {
    return null
  }
}

/**
 * Enregistre une valeur en cache, horodatée.
 * @param {string} key
 * @param {any} value
 */
export function setCached(key, value) {
  if (!storageOk) return
  try {
    window.localStorage.setItem(key, JSON.stringify({ value, savedAt: Date.now() }))
  } catch {
    // Quota dépassé ou storage indisponible : on échoue silencieusement, sans casser l'UI.
  }
}

/**
 * Supprime une entrée du cache (utile pour invalider manuellement, ex: après une action admin).
 * @param {string} key
 */
export function clearCached(key) {
  if (!storageOk) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // no-op
  }
}
