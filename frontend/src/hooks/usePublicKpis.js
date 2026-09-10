import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getCached, setCached } from '../lib/cache'

const CACHE_KEY = 'espa:public_landing_kpis'
// Au-delà de ce délai, la valeur en cache est considérée périmée et revalidée en arrière-plan.
// À ajuster selon la fréquence réelle de mise à jour des réponses (10 min est un bon compromis
// fraîcheur / charge DB pour un compteur agrégé public).
const STALE_AFTER_MS = 10 * 60 * 1000

const EMPTY_KPIS = { n: 0, transportPct: 0, ledPct: 0, triPct: 0 }

// Cache mémoire partagé entre tous les montages du composant pendant la session SPA (onglet ouvert).
// Distinct du localStorage : évite même la lecture/parse JSON lors d'une navigation interne rapide.
let memoryCache = null
// Déduplique les appels concurrents (ex: React StrictMode qui monte les effets deux fois en dev,
// ou plusieurs instances du hook montées en même temps).
let inFlightPromise = null

function normalizeKpis(metrics) {
  return {
    n: Number(metrics?.response_count || 0),
    transportPct: Number(metrics?.transport_pct || 0),
    ledPct: Number(metrics?.led_pct || 0),
    triPct: Number(metrics?.tri_pct || 0),
  }
}

async function fetchFromSupabase() {
  const { data, error } = await supabase.rpc('get_public_landing_kpis')
  if (error) throw error
  return normalizeKpis(data?.[0])
}

/**
 * Fournit les indicateurs publics agrégés de la landing page, avec cache mémoire + localStorage (TTL).
 *
 * Stratégie stale-while-revalidate :
 * - Si une valeur est déjà en cache (mémoire ou localStorage), elle est affichée immédiatement,
 *   sans état de chargement (pas de flash de skeleton).
 * - Si cette valeur a dépassé STALE_AFTER_MS, une revalidation silencieuse est déclenchée en
 *   arrière-plan (le loader n'est pas ré-activé) et met à jour l'affichage une fois reçue.
 * - Si aucune valeur n'est en cache, un fetch classique est effectué avec loadingStats=true.
 */
export function usePublicKpis() {
  const [kpis, setKpis] = useState(() => memoryCache ?? getCached(CACHE_KEY)?.value ?? EMPTY_KPIS)
  const [loadingStats, setLoadingStats] = useState(() => !memoryCache && !getCached(CACHE_KEY))
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const cached = memoryCache
      ? { value: memoryCache, isStale: false }
      : getCached(CACHE_KEY, { staleAfterMs: STALE_AFTER_MS })

    const revalidate = async () => {
      try {
        inFlightPromise = inFlightPromise ?? fetchFromSupabase()
        const fresh = await inFlightPromise
        memoryCache = fresh
        setCached(CACHE_KEY, fresh)
        if (mountedRef.current) setKpis(fresh)
      } catch (err) {
        console.error('Erreur lors de la récupération des KPI publics:', err)
        // On ne réinitialise à zéro que s'il n'y avait aucune valeur affichable en cache.
        if (mountedRef.current && !cached) setKpis(EMPTY_KPIS)
      } finally {
        inFlightPromise = null
        if (mountedRef.current) setLoadingStats(false)
      }
    }

    if (cached) {
      setKpis(cached.value)
      setLoadingStats(false)
      if (cached.isStale) revalidate() // silencieux : pas de re-passage à loading=true
    } else {
      setLoadingStats(true)
      revalidate()
    }

    return () => {
      mountedRef.current = false
    }
  }, [])

  return { kpis, loadingStats }
}
