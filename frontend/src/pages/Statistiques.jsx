import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, ScatterChart, Scatter, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import {
  TrendingUp, Car, Droplet, Zap, Trash2,
  Coffee, Laptop, Home, Utensils,
  Volume2, ShieldAlert, Shirt, Clock,
  Info, Sliders, Tv, Users, MapPin, BarChart3, GitCompare
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
// Shows the raw series value(s) AND, whenever the underlying data point
// carries a `pct`/`total` or `n` field, a second line with the effectif
// (n=20 rule: never show a % without the count it is built from).
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
      logement: 'residence_universitaire',
      transport: ['transport_commun', 'pied'],
      frequence_venue: 5, frequence_depart: 10,
      domicialisation_ville: 'Vontovorona',
      domicialisation_distance_vontovorona: 2,
      repas: { repas_maison: ['riz', 'legumes'], cantine: ['menu_du_jour'] },
      gouters: ['fruits'],
      cafe_boit: true, cafe_frequence_jour: 2,
      douche_quotidienne: true, douche_frequence: 7,
      eau_bouillir: false,
      vetements_semaine: 5, vetements_laver_repasser: 5,
      brushing_utilise: false, lissage_utilise: false,
      telephone_marque: 'Samsung', recharge_telephone_jour: 2,
      ecrans_tel_heures_jour: 4.5,
      pc_possede: true, pc_nombre: 1,
      pc_usage: ['etudes', 'reseaux_sociaux'],
      recharge_pc_frequence: 1, ecrans_pc_heures_jour: 6,
      tablette_possede: false,
      alcool_boit: false, nuisance_sonore: true,
      ordures_quantite: 'un_sac_moyen'
    }
  },
  {
    answers: {
      logement: 'chez_parents',
      transport: ['voiture'],
      frequence_venue: 4, frequence_depart: 8,
      domicialisation_ville: 'Antanimena',
      domicialisation_distance_vontovorona: 14.5,
      repas: { repas_maison: ['riz', 'viande'], fast_food: ['burger'] },
      gouters: ['biscuits_sucres'],
      cafe_boit: true, cafe_frequence_jour: 3,
      douche_quotidienne: true, douche_frequence: 7,
      eau_bouillir: true,
      vetements_semaine: 7, vetements_laver_repasser: 7,
      brushing_utilise: true, lissage_utilise: true,
      telephone_marque: 'iPhone', recharge_telephone_jour: 2,
      ecrans_tel_heures_jour: 5,
      pc_possede: true, pc_nombre: 1,
      pc_usage: ['etudes', 'loisir_jeux', 'travail'],
      recharge_pc_frequence: 2, ecrans_pc_heures_jour: 8,
      tablette_possede: true, tablette_nombre: 1,
      recharge_tablette_frequence: 1,
      alcool_boit: true, nuisance_sonore: false,
      ordures_quantite: 'deux_sacs_ou_plus'
    }
  },
  {
    answers: {
      logement: 'colocation',
      transport: ['transport_commun', 'moto'],
      frequence_venue: 5, frequence_depart: 10,
      domicialisation_ville: 'Anosibe',
      domicialisation_distance_vontovorona: 11,
      repas: { repas_maison: ['feculents'], repas_rue: ['mofo_gasy', 'brochettes_rue'], saute_repas: true },
      gouters: ['snacks_sales'],
      cafe_boit: true, cafe_frequence_jour: 1,
      douche_quotidienne: false, douche_frequence: 4,
      eau_bouillir: true,
      vetements_semaine: 4, vetements_laver_repasser: 4,
      brushing_utilise: false, lissage_utilise: false,
      telephone_marque: 'Xiaomi', recharge_telephone_jour: 1,
      ecrans_tel_heures_jour: 3.5,
      pc_possede: true, pc_nombre: 1,
      pc_usage: ['etudes'],
      recharge_pc_frequence: 1, ecrans_pc_heures_jour: 4,
      tablette_possede: false,
      alcool_boit: false, nuisance_sonore: true,
      ordures_quantite: 'moins_petit_sac'
    }
  },
  {
    answers: {
      logement: 'location_seul',
      transport: ['velo'],
      frequence_venue: 6, frequence_depart: 12,
      domicialisation_ville: 'Vontovorona',
      domicialisation_distance_vontovorona: 1.5,
      repas: { repas_maison: ['riz', 'legumineuses'], cantine: ['sandwich'] },
      gouters: ['fruits', 'biscuits_sucres'],
      cafe_boit: false,
      douche_quotidienne: true, douche_frequence: 7,
      eau_bouillir: false,
      vetements_semaine: 6, vetements_laver_repasser: 5,
      brushing_utilise: false, lissage_utilise: false,
      telephone_marque: 'Realme', recharge_telephone_jour: 1,
      ecrans_tel_heures_jour: 3,
      pc_possede: true, pc_nombre: 1,
      pc_usage: ['etudes', 'travail'],
      recharge_pc_frequence: 1, ecrans_pc_heures_jour: 7,
      tablette_possede: false,
      alcool_boit: false, nuisance_sonore: false,
      ordures_quantite: 'un_sac_moyen'
    }
  },
  {
    answers: {
      logement: 'residence_universitaire',
      transport: ['pied', 'transport_commun'],
      frequence_venue: 5, frequence_depart: 10,
      domicialisation_ville: 'Vontovorona',
      domicialisation_distance_vontovorona: 0.8,
      repas: { cantine: ['menu_du_jour', 'salade'], repas_rue: ['mofo_gasy'] },
      gouters: ['rien'],
      cafe_boit: true, cafe_frequence_jour: 1,
      douche_quotidienne: true, douche_frequence: 7,
      eau_bouillir: false,
      vetements_semaine: 4, vetements_laver_repasser: 3,
      brushing_utilise: false, lissage_utilise: false,
      telephone_marque: 'Tecno', recharge_telephone_jour: 1,
      ecrans_tel_heures_jour: 5,
      pc_possede: false,
      tablette_possede: false,
      alcool_boit: false, nuisance_sonore: true,
      ordures_quantite: 'moins_petit_sac'
    }
  },
  {
    answers: {
      logement: 'chez_parents',
      transport: ['moto', 'transport_commun'],
      frequence_venue: 3, frequence_depart: 6,
      domicialisation_ville: 'Ambohijanaka',
      domicialisation_distance_vontovorona: 18,
      repas: { repas_maison: ['riz', 'poisson', 'legumes'], fast_food: ['frites', 'brochettes_grillades'] },
      gouters: ['snacks_sales', 'biscuits_sucres'],
      cafe_boit: true, cafe_frequence_jour: 2,
      douche_quotidienne: true, douche_frequence: 7,
      eau_bouillir: true,
      vetements_semaine: 5, vetements_laver_repasser: 5,
      brushing_utilise: true, lissage_utilise: false,
      telephone_marque: 'Samsung', recharge_telephone_jour: 2,
      ecrans_tel_heures_jour: 6,
      pc_possede: true, pc_nombre: 1,
      pc_usage: ['etudes', 'reseaux_sociaux', 'loisir_jeux'],
      recharge_pc_frequence: 1, ecrans_pc_heures_jour: 5,
      tablette_possede: false,
      alcool_boit: true, nuisance_sonore: false,
      ordures_quantite: 'un_sac_moyen'
    }
  }
]

// ── Label maps ─────────────────────────────────────────────────────────
const LABELS = {
  logement: {
    residence_universitaire: 'Résidence U.',
    chez_parents: 'Chez parents',
    colocation: 'Colocation',
    location_seul: 'Location seul',
    autre: 'Autre'
  },
  transport: {
    transport_commun: 'Transports en commun',
    pied: 'À pied',
    voiture: 'Voiture',
    moto: 'Moto',
    velo: 'Vélo',
    autre: 'Autre'
  },
  repas: {
    maison: 'Repas maison',
    cantine: 'Cantine',
    fast_food: 'Fast food',
    repas_rue: 'Repas de rue'
  },
  pcUsage: {
    etudes: 'Études',
    loisir_jeux: 'Loisirs & Jeux',
    travail: 'Travail',
    reseaux_sociaux: 'Réseaux sociaux',
    autre: 'Autre'
  },
  waste: {
    moins_petit_sac: '< 1 petit sac',
    un_sac_moyen: '1 sac moyen',
    deux_sacs_ou_plus: '2+ sacs',
    ne_sait_pas: 'Ne sait pas'
  }
}

const CO2_FACTORS = { voiture: 0.19, moto: 0.10, transport_commun: 0.04, velo: 0, pied: 0, autre: 0.08 }

// ── Small stats helper: build a 0..7 (or min..max) count histogram ─────
function binCounts(values, min, max, suffix = 'j') {
  const bins = {}
  for (let i = min; i <= max; i++) bins[i] = 0
  values.forEach(v => {
    const iv = Math.min(max, Math.max(min, Math.round(v)))
    bins[iv] = (bins[iv] || 0) + 1
  })
  return Object.entries(bins).map(([k, v]) => ({ name: `${k}${suffix}`, value: v }))
}

// ── Reusable chart card wrapper ────────────────────────────────────────
// `badge` shows the effectif (n=...) directly in the card header so the
// sample size is always visible next to the chart, not just on hover.
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
  const [targetPopulation, setTargetPopulation] = useState(5000)
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
    const K = targetPopulation / n
    const W = 36 // weeks/year

    const logementCounts = {}
    const transportCounts = {}
    const repasTypeCounts = { maison: 0, cantine: 0, fast_food: 0, repas_rue: 0 }
    const pcUsageCounts = {}
    const wasteCounts = { moins_petit_sac: 0, un_sac_moyen: 0, deux_sacs_ou_plus: 0, ne_sait_pas: 0 }
    const goutersCounts = {}

    // Cross-tab accumulators (n=20 → limited to binary/low-cardinality crossings)
    const venueByLogement = {}       // logement -> { sum, count }
    const sauteByLogement = {}       // logement -> { saute, total }
    const distByPrimaryTransport = {} // primary transport mode -> { sum, count }

    let totalDistKm = 0, totalWeeklyKm = 0, totalCo2Kg = 0
    let sauteRepas = 0, cafeDrinkers = 0, totalCupsDay = 0
    let totalShowers = 0, boilingCount = 0
    let totalOutfitsWorn = 0, totalOutfitsWash = 0
    let brushingCount = 0, lissageCount = 0
    let pcOwners = 0, tabletOwners = 0
    let totalPhoneCharges = 0, totalPhoneHrs = 0
    let totalPcCharges = 0, totalPcHrs = 0
    let totalTabletCharges = 0
    let alcoholCount = 0, noiseCount = 0

    const venueValues = []
    const showerValues = []
    const screenTimeScatterData = []

    responses.forEach((r, idx) => {
      const a = r.answers || {}

      // Logement
      const log = a.logement || 'autre'
      logementCounts[log] = (logementCounts[log] || 0) + 1

      // Transport
      const tList = Array.isArray(a.transport) ? a.transport : []
      const dist = parseFloat(a.domicialisation_distance_vontovorona) || 0
      const trips = parseInt(a.frequence_depart) || 0
      totalDistKm += dist
      const studentWeekKm = trips * dist * 2
      totalWeeklyKm += studentWeekKm

      tList.forEach(t => {
        transportCounts[t] = (transportCounts[t] || 0) + 1
        totalCo2Kg += (studentWeekKm / Math.max(tList.length, 1)) * (CO2_FACTORS[t] ?? 0.05)
      })

      // Distance moyenne selon le mode de transport principal (1er coché)
      const primaryMode = tList[0] || 'autre'
      if (!distByPrimaryTransport[primaryMode]) distByPrimaryTransport[primaryMode] = { sum: 0, count: 0 }
      distByPrimaryTransport[primaryMode].sum += dist
      distByPrimaryTransport[primaryMode].count += 1

      // Fréquence de venue : histogramme + moyenne par logement
      const venue = parseInt(a.frequence_venue) || 0
      venueValues.push(venue)
      if (!venueByLogement[log]) venueByLogement[log] = { sum: 0, count: 0 }
      venueByLogement[log].sum += venue
      venueByLogement[log].count += 1

      // Alimentation
      const skipsRepas = !!(a.repas && a.repas.saute_repas)
      if (a.repas) {
        if (a.repas.repas_maison) repasTypeCounts.maison++
        if (a.repas.cantine) repasTypeCounts.cantine++
        if (a.repas.fast_food) repasTypeCounts.fast_food++
        if (a.repas.repas_rue) repasTypeCounts.repas_rue++
        if (skipsRepas) sauteRepas++
      }
      if (!sauteByLogement[log]) sauteByLogement[log] = { saute: 0, total: 0 }
      sauteByLogement[log].total += 1
      if (skipsRepas) sauteByLogement[log].saute += 1

      if (a.cafe_boit) { cafeDrinkers++; totalCupsDay += parseInt(a.cafe_frequence_jour) || 1 }
      if (Array.isArray(a.gouters)) a.gouters.forEach(g => { goutersCounts[g] = (goutersCounts[g] || 0) + 1 })

      // Hygiène
      const showers = parseInt(a.douche_frequence) || (a.douche_quotidienne ? 7 : 3)
      totalShowers += showers
      showerValues.push(showers)
      if (a.eau_bouillir) boilingCount++
      totalOutfitsWorn += parseInt(a.vetements_semaine) || 0
      totalOutfitsWash += parseInt(a.vetements_laver_repasser) || 0
      if (a.brushing_utilise) brushingCount++
      if (a.lissage_utilise) lissageCount++

      // Tech
      const phoneHrs = parseFloat(a.ecrans_tel_heures_jour) || 0
      const phoneCharges = parseInt(a.recharge_telephone_jour) || 0
      totalPhoneCharges += phoneCharges
      totalPhoneHrs += phoneHrs
      screenTimeScatterData.push({ id: idx + 1, heures: phoneHrs, recharges: phoneCharges })

      if (a.pc_possede) {
        pcOwners++
        totalPcCharges += parseInt(a.recharge_pc_frequence) || 0
        totalPcHrs += parseFloat(a.ecrans_pc_heures_jour) || 0
        if (Array.isArray(a.pc_usage)) a.pc_usage.forEach(u => { pcUsageCounts[u] = (pcUsageCounts[u] || 0) + 1 })
      }
      if (a.tablette_possede) {
        tabletOwners++
        totalTabletCharges += parseInt(a.recharge_tablette_frequence) || 0
      }

      // Mode de vie
      if (a.alcool_boit) alcoholCount++
      if (a.nuisance_sonore) noiseCount++
      const w = a.ordures_quantite || 'un_sac_moyen'
      wasteCounts[w] = (wasteCounts[w] || 0) + 1
    })

    // KPIs (base échantillon)
    const avgShowers = totalShowers / n
    const pctBoiling = boilingCount / n

    // KPIs (extrapolation — indicative uniquement, n faible)
    const annualCo2Tonnes = ((totalCo2Kg / n) * targetPopulation * W) / 1000
    const annualWaterMLiters = (avgShowers * 50 * targetPopulation * W) / 1_000_000
    const dailyTechKwh = ((totalPhoneCharges / n) * 0.015) + ((totalPcCharges / n) * 0.06) + ((totalTabletCharges / n) * 0.03)
    const annualTechMWh = (dailyTechKwh * 365 * targetPopulation) / 1000
    const annualThermalMWh = (pctBoiling * avgShowers * 1.8 * W * targetPopulation) / 1000
    const wasteL = ((wasteCounts.moins_petit_sac * 5) + (wasteCounts.un_sac_moyen * 25) + (wasteCounts.deux_sacs_ou_plus * 50) + (wasteCounts.ne_sait_pas * 20)) / n
    const annualWasteM3 = (wasteL * W * targetPopulation) / 1000

    // ── Build chart data arrays — comptages (value) en donnée principale,
    // le pourcentage (pct) reste disponible en info secondaire (tooltip).
    const logementData = Object.entries(LABELS.logement).map(([k, label]) => ({
      name: label,
      value: logementCounts[k] || 0,
      pct: Math.round(((logementCounts[k] || 0) / n) * 100),
      total: n
    })).filter(d => d.value > 0)

    const transportData = Object.entries(LABELS.transport).map(([k, label]) => ({
      name: label,
      value: transportCounts[k] || 0,
      pct: Math.round(((transportCounts[k] || 0) / n) * 100),
      total: n
    })).filter(d => d.value > 0)

    const repasData = Object.entries(LABELS.repas).map(([k, label]) => ({
      name: label,
      value: repasTypeCounts[k] || 0,
      pct: Math.round(((repasTypeCounts[k] || 0) / n) * 100),
      total: n
    }))

    const pcUsageData = Object.entries(LABELS.pcUsage).map(([k, label]) => ({
      name: label,
      value: pcUsageCounts[k] || 0,
      pct: Math.round(((pcUsageCounts[k] || 0) / n) * 100),
      total: n
    })).filter(d => d.value > 0)

    const wasteData = Object.entries(LABELS.waste).map(([k, label]) => ({
      name: label,
      value: wasteCounts[k] || 0,
      pct: Math.round(((wasteCounts[k] || 0) / n) * 100),
      total: n
    })).filter(d => d.value > 0)

    const screenTimeData = [
      { name: 'Smartphone', heures: Math.round((totalPhoneHrs / n) * 10) / 10 },
      { name: 'Ordinateur', heures: pcOwners ? Math.round((totalPcHrs / pcOwners) * 10) / 10 : 0 },
    ]

    const equipmentData = [
      { name: 'Smartphone', pct: 100, n, total: n },
      { name: 'Ordinateur', pct: Math.round((pcOwners / n) * 100), n: pcOwners, total: n },
      { name: 'Tablette', pct: Math.round((tabletOwners / n) * 100), n: tabletOwners, total: n },
    ]

    const hygieneRadarData = [
      { metric: 'Douches/sem', value: Math.round(avgShowers * 10) / 10 },
      { metric: 'Tenues/sem', value: Math.round((totalOutfitsWorn / n) * 10) / 10 },
      { metric: 'Lavage/sem', value: Math.round((totalOutfitsWash / n) * 10) / 10 },
      { metric: 'Brushing %', value: Math.round((brushingCount / n) * 100) },
      { metric: 'Lissage %', value: Math.round((lissageCount / n) * 100) },
      { metric: 'Eau bouillie %', value: Math.round(pctBoiling * 100) },
    ]

    const outfitsComparisonData = [
      { name: 'Tenues portées', value: Math.round((totalOutfitsWorn / n) * 10) / 10 },
      { name: 'Tenues lavées/repassées', value: Math.round((totalOutfitsWash / n) * 10) / 10 },
    ]

    const modeDeVieData = [
      { name: 'Nuisance sonore', pct: Math.round((noiseCount / n) * 100), value: noiseCount, total: n },
      { name: 'Alcool', pct: Math.round((alcoholCount / n) * 100), value: alcoholCount, total: n },
      { name: 'Saute repas', pct: Math.round((sauteRepas / n) * 100), value: sauteRepas, total: n },
      { name: 'Eau bouillie', pct: Math.round(pctBoiling * 100), value: boilingCount, total: n },
    ]

    // Histogrammes de distribution (0 à 7 jours/semaine)
    const venueHistogramData = binCounts(venueValues, 0, 7).map(d => ({
      ...d, pct: Math.round((d.value / n) * 100), total: n
    }))
    const showerHistogramData = binCounts(showerValues, 0, 7).map(d => ({
      ...d, pct: Math.round((d.value / n) * 100), total: n
    }))

    // Distance moyenne selon le mode de transport principal
    const distByTransportData = Object.entries(distByPrimaryTransport)
      .map(([k, v]) => ({
        name: LABELS.transport[k] || k,
        moyenne: Math.round((v.sum / v.count) * 10) / 10,
        n: v.count
      }))
      .sort((a, b) => b.moyenne - a.moyenne)

    // Fréquence de venue moyenne selon le logement
    const venueByLogementData = Object.entries(venueByLogement).map(([k, v]) => ({
      name: LABELS.logement[k] || k,
      moyenne: Math.round((v.sum / v.count) * 10) / 10,
      n: v.count
    }))

    // Étudiants qui sautent des repas, selon le logement
    const sauteRepasByLogementData = Object.entries(sauteByLogement).map(([k, v]) => ({
      name: LABELS.logement[k] || k,
      value: v.saute,
      pct: Math.round((v.saute / v.total) * 100),
      total: v.total
    }))

    return {
      n, K,
      annualCo2Tonnes: Math.round(annualCo2Tonnes * 10) / 10,
      annualWaterMLiters: Math.round(annualWaterMLiters * 10) / 10,
      totalAnnualEnergyMWh: Math.round((annualTechMWh + annualThermalMWh) * 10) / 10,
      annualWasteM3: Math.round(annualWasteM3),
      avgDistKm: Math.round((totalDistKm / n) * 10) / 10,
      avgWeeklyKm: Math.round((totalWeeklyKm / n) * 10) / 10,
      sauteRepasCount: sauteRepas,
      pctSauteRepas: Math.round((sauteRepas / n) * 100),
      cafeDrinkersCount: cafeDrinkers,
      pctCafeDrinkers: Math.round((cafeDrinkers / n) * 100),
      avgCoffee: cafeDrinkers ? Math.round((totalCupsDay / cafeDrinkers) * 10) / 10 : 0,
      annualCoffee: Math.round((totalCupsDay / n) * 365 * targetPopulation),
      pcOwnersCount: pcOwners,
      pctPcOwner: Math.round((pcOwners / n) * 100),
      tabletOwnersCount: tabletOwners,
      pctTabletOwner: Math.round((tabletOwners / n) * 100),
      logementData, transportData, repasData, pcUsageData, wasteData,
      screenTimeData, equipmentData, hygieneRadarData, modeDeVieData,
      outfitsComparisonData, venueHistogramData, showerHistogramData,
      distByTransportData, venueByLogementData, sauteRepasByLogementData,
      screenTimeScatterData
    }
  }, [responses, targetPopulation])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-2 md:px-0">
        <LoadingSpinner message="Calcul des statistiques et extrapolations..." />
      </div>
    )
  }

  const TABS = [
    { id: 'tous', label: 'Vue d\'ensemble' },
    { id: 'transport', label: 'Transport & Logement' },
    { id: 'alimentation', label: 'Alimentation' },
    { id: 'hygiene', label: 'Hygiène & Énergie' },
    { id: 'technologie', label: 'Technologie' },
    { id: 'environnement', label: 'Environnement' }
  ]

  const axisStyle = { fontSize: 11, fill: theme.textSecondary }

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0 pb-16">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Statistiques & Extrapolations</h1>
          </div>
          <p className="text-text-secondary text-sm mt-1">
            Analyse de l'échantillon d'enquête CampusPulse (n = {stats.n}).
          </p>
        </div>
        {isDemoData && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20 text-xs font-medium">
            <Info className="w-4 h-4" />
            <span>Données d'illustration (échantillon de test)</span>
          </div>
        )}
      </div>

      {/* ── Vue d'ensemble de l'échantillon (comptages bruts, pas d'extrapolation) ── */}
      <SectionHeader icon={Users} title="Vue d'Ensemble de l'Échantillon" color="text-primary" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Users} color="text-primary" bg="bg-primary/10"
          label="Répondants" value={stats.n} unit="étudiant(e)s"
          sub="Taille actuelle de l'échantillon (cible ~20)" />
        <KpiCard icon={MapPin} color="text-secondary" bg="bg-secondary/10"
          label="Distance Moyenne" value={stats.avgDistKm} unit="km"
          sub="Domicile → campus Vontovorona" />
        <KpiCard icon={ShieldAlert} color="text-danger" bg="bg-danger/10"
          label="Sautent un Repas" value={`${stats.sauteRepasCount}/${stats.n}`} unit=""
          sub={`${stats.pctSauteRepas}% de l'échantillon`} />
        <KpiCard icon={Clock} color="text-warning" bg="bg-warning/10"
          label="Écran Téléphone" value={stats.screenTimeData[0]?.heures ?? 0} unit="h/jour"
          sub="Moyenne quotidienne déclarée" />
      </div>

      {/* ── Extrapolation controller ────────────────────────── */}
      <div className="bg-surface border border-primary/20 rounded-2xl p-5 md:p-6 mb-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Sliders className="w-4 h-4" />
              Simulateur de Population
            </div>
            <p className="text-xs text-text-secondary">
              Ajustez l'effectif total du campus pour projeter des ordres de grandeur d'impact à partir de l'échantillon de {stats.n} répondant(s).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg/80 border border-text-secondary/10 p-4 rounded-xl">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-extrabold text-primary">
                {targetPopulation.toLocaleString()}
              </div>
              <div className="text-[11px] text-text-secondary">
                étudiants · facteur ×{stats.K.toFixed(1)}
              </div>
            </div>
            <div className="w-full sm:w-48 space-y-1">
              <input
                type="range" min="500" max="20000" step="250"
                value={targetPopulation}
                onChange={(e) => setTargetPopulation(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-text-secondary/20 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                <span>500</span><span>10k</span><span>20k</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-lg p-3">
          <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Projection indicative uniquement : avec un échantillon de n = {stats.n}, les totaux ci-dessous illustrent un ordre de grandeur
            et ne constituent pas une estimation statistiquement robuste. Se référer en priorité aux comptages de l'échantillon ci-dessus.
          </p>
        </div>
      </div>

      {/* ── KPI cards extrapolées ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Car} color="text-danger" bg="bg-danger/10"
          label="CO₂ Transports" value={stats.annualCo2Tonnes} unit="t CO₂/an"
          sub={`${stats.avgWeeklyKm} km/sem/étudiant`} />
        <KpiCard icon={Droplet} color="text-primary" bg="bg-primary/10"
          label="Eau Hygiène" value={stats.annualWaterMLiters} unit="M. litres/an"
          sub="Pour les douches uniquement" />
        <KpiCard icon={Zap} color="text-warning" bg="bg-warning/10"
          label="Énergie" value={stats.totalAnnualEnergyMWh} unit="MWh/an"
          sub="Tech + chauffage eau" />
        <KpiCard icon={Trash2} color="text-secondary" bg="bg-secondary/10"
          label="Déchets" value={stats.annualWasteM3} unit="m³/an"
          sub="Ordures ménagères solides" />
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
          SECTION 1 — TRANSPORT & LOGEMENT
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'transport') && (
        <section className="mb-10">
          <SectionHeader icon={Car} title="Transport & Logement" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Bar (ex-pie): Logement */}
            <ChartCard title="Répartition des Logements" icon={Home} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.logementData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={20}>
                    {stats.logementData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Bar: Transport (multi-select) */}
            <ChartCard title="Modes de Transport Utilisés" icon={Car} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.transportData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={130} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={18}>
                    {stats.transportData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Choix multiple : la somme peut dépasser n.</p>
            </ChartCard>

            {/* Histogramme : fréquence de venue */}
            <ChartCard title="Fréquence de Venue au Campus" icon={BarChart3} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.venueHistogramData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={26} fill={theme.primary} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Distribution du nombre de jours/semaine sur le campus.</p>
            </ChartCard>

            {/* Distance moyenne selon mode de transport principal */}
            <ChartCard title="Distance Domicile-Campus par Mode de Transport" icon={MapPin} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.distByTransportData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-15} textAnchor="end" height={55} />
                  <YAxis tick={axisStyle} unit="km" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="moyenne" name="Distance moy. (km)" radius={[6, 6, 0, 0]} barSize={30} fill={theme.secondary} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Mode de transport principal (1er coché) — voir n par groupe au survol.</p>
            </ChartCard>

            {/* Croisement : fréquence de venue moyenne selon logement */}
            <ChartCard title="Venue Moyenne au Campus selon le Logement" icon={GitCompare} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.venueByLogementData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} unit="j" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="moyenne" name="Jours/semaine (moy.)" radius={[6, 6, 0, 0]} barSize={36} fill={theme.primary} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">
                Effectifs par sous-groupe faibles (n petit) — à lire comme tendance, pas comme résultat statistiquement tranché.
              </p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — ALIMENTATION
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'alimentation') && (
        <section className="mb-10">
          <SectionHeader icon={Utensils} title="Alimentation, Vulnérabilité & Café" color="text-warning" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bar: Repas types */}
            <ChartCard title="Types de Restauration" icon={Utensils} iconColor="text-warning" badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.repasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={28} fill={theme.warning} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Vulnerability indicator */}
            <ChartCard title="Précarité Alimentaire" icon={ShieldAlert} iconColor="text-danger">
              <div className="flex flex-col items-center justify-center h-[220px] gap-3">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" stroke={theme.bg} strokeWidth="12" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke={theme.danger} strokeWidth="12" fill="none"
                      strokeDasharray={`${stats.pctSauteRepas * 3.14} 314`}
                      strokeLinecap="round" className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-danger">{stats.pctSauteRepas}%</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary text-center leading-relaxed max-w-[200px]">
                  <span className="font-semibold text-danger">{stats.sauteRepasCount}/{stats.n}</span> étudiant(e)s de l'échantillon
                  déclarent <span className="font-semibold text-danger">sauter des repas</span>.
                </p>
              </div>
            </ChartCard>

            {/* Coffee */}
            <ChartCard title="Consommation de Café" icon={Coffee} iconColor="text-warning">
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between bg-bg p-3 rounded-xl">
                  <span className="text-xs text-text-secondary">Buveurs de café</span>
                  <span className="text-lg font-bold text-warning">{stats.cafeDrinkersCount}/{stats.n} <span className="text-xs font-normal">({stats.pctCafeDrinkers}%)</span></span>
                </div>
                <div className="flex items-center justify-between bg-bg p-3 rounded-xl">
                  <span className="text-xs text-text-secondary">Tasses / jour / consommateur</span>
                  <span className="text-lg font-bold text-warning">{stats.avgCoffee}</span>
                </div>
                <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl text-center">
                  <div className="text-[11px] text-text-secondary font-medium">Volume Annuel Projeté (indicatif)</div>
                  <div className="text-xl font-extrabold text-warning">
                    {stats.annualCoffee.toLocaleString()} <span className="text-xs font-normal text-text-secondary">tasses/an</span>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* Croisement : saute repas selon logement */}
            <ChartCard title="Repas Sautés selon le Logement" icon={GitCompare} badge={`n=${stats.n}`} className="md:col-span-3">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.sauteRepasByLogementData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Sautent un repas" radius={[6, 6, 0, 0]} barSize={36} fill={theme.danger} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">
                Effectif par type de logement souvent très faible (n ≤ 5) — indicateur à confirmer avec plus de réponses.
              </p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — HYGIÈNE & ÉNERGIE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'hygiene') && (
        <section className="mb-10">
          <SectionHeader icon={Droplet} title="Hygiène, Eau & Vêtements" color="text-primary" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Radar: Hygiène overview */}
            <ChartCard title="Profil Hygiène Moyen" icon={Droplet} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.hygieneRadarData}>
                  <PolarGrid stroke={theme.textSecondary + '30'} />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: theme.textSecondary }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 9, fill: theme.textSecondary }} />
                  <Radar name="Moyenne" dataKey="value" stroke={theme.primary} fill={theme.primary} fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Clothing & Hair stats */}
            <ChartCard title="Vêtements & Soins Capillaires" icon={Shirt} iconColor="text-secondary">
              <div className="space-y-3">
                {stats.hygieneRadarData.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-text-primary">
                      <span>{d.metric}</span>
                      <span className="text-text-secondary font-mono">{d.value}</span>
                    </div>
                    <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(d.value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Histogramme : fréquence de douche */}
            <ChartCard title="Fréquence de Douche" icon={BarChart3} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.showerHistogramData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={26} fill={theme.primary} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">Distribution du nombre de douches/semaine.</p>
            </ChartCard>

            {/* Comparaison : tenues portées vs lavées/repassées */}
            <ChartCard title="Tenues Portées vs Lavées/Repassées" icon={Shirt} iconColor="text-secondary" badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.outfitsComparisonData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-10} textAnchor="end" height={45} />
                  <YAxis tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Moyenne/semaine" radius={[6, 6, 0, 0]} barSize={56}>
                    <Cell fill={theme.primary} />
                    <Cell fill={theme.secondary} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2 text-center">
                Écart moyen : {Math.round((stats.outfitsComparisonData[0].value - stats.outfitsComparisonData[1].value) * 10) / 10} tenue(s)/semaine non lavées ou repassées.
              </p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — TECHNOLOGIE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'technologie') && (
        <section className="mb-10">
          <SectionHeader icon={Laptop} title="Technologie & Temps d'Écran" color="text-primary" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Bar: Screen time */}
            <ChartCard title="Temps d'Écran Quotidien Moyen" icon={Clock} badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.screenTimeData} margin={{ top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} unit="h" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="heures" name="Heures/jour" radius={[6, 6, 0, 0]} barSize={48}>
                    <Cell fill={theme.primary} />
                    <Cell fill={CHART_COLORS[4]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Equipment rates */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                {stats.equipmentData.map((d, i) => (
                  <div key={i} className="bg-bg rounded-xl p-2.5">
                    <div className="text-text-secondary">{d.name}</div>
                    <div className="text-lg font-extrabold text-primary">{d.pct}%</div>
                    <div className="text-[10px] text-text-secondary font-mono">{d.n}/{d.total}</div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Bar (ex-pie): PC usage */}
            <ChartCard title="Usages Principaux de l'Ordinateur" icon={Tv} badge={`n=${stats.pcOwnersCount} (possesseurs de PC)`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.pcUsageData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" tick={axisStyle} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={120} tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[0, 6, 6, 0]} barSize={18}>
                    {stats.pcUsageData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Scatter : écran vs recharges téléphone */}
            <ChartCard title="Temps d'Écran vs Recharges (Téléphone)" icon={Clock} badge={`n=${stats.n}`} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis type="number" dataKey="heures" name="Écran" unit="h/j" tick={axisStyle} />
                  <YAxis type="number" dataKey="recharges" name="Recharges" unit="/j" tick={axisStyle} allowDecimals={false} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Scatter name="Étudiant" data={stats.screenTimeScatterData} fill={theme.primary} />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-2">
                Chaque point = un·e étudiant·e. Seul croisement numérique-numérique du jeu de données : teste si plus d'écran va avec plus de recharges.
              </p>
            </ChartCard>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — ENVIRONNEMENT & MODE DE VIE
          ═══════════════════════════════════════════════════════ */}
      {(activeTab === 'tous' || activeTab === 'environnement') && (
        <section className="mb-10">
          <SectionHeader icon={Trash2} title="Environnement & Cadre de Vie" color="text-secondary" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Bar: Waste */}
            <ChartCard title="Quantité d'Ordures / Semaine" icon={Trash2} iconColor="text-secondary" badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.wasteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Étudiants" radius={[6, 6, 0, 0]} barSize={32} fill={theme.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Area: mode de vie indicators */}
            <ChartCard title="Indicateurs Qualité de Vie" icon={Volume2} iconColor="text-warning" badge={`n=${stats.n}`}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={stats.modeDeVieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.textSecondary + '20'} />
                  <XAxis dataKey="name" tick={axisStyle} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={axisStyle} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="pct" name="%" stroke={theme.warning} fill={theme.warning} fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-text-secondary mt-3">
                Données déclaratives recueillies de manière anonyme dans l'enquête CampusPulse. Survoler un point pour voir l'effectif.
              </p>
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