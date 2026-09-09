import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import espaBg from '../assets/espa_bg.jpg'
import espaBg1 from '../assets/espa_bg_1.jpeg'
import {
  LogOut,
  ArrowRight,
  BarChart3,
  Users,
  Leaf,
  ChevronDown,
  Bus,
  Droplets,
  Utensils,
  Laptop,
  Shirt,
  Sparkle,
  Trash2,
  Compass,
  CheckCircle2,
  Menu,
  X,
  LayoutDashboard,
  ExternalLink,
  GraduationCap,
  Award,
  ChevronRight,
} from 'lucide-react'

function Landing() {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(0)
  const [activePilier, setActivePilier] = useState(0)

  // Indicateurs publics agrégés : aucune réponse individuelle n'est exposée.
  const [kpis, setKpis] = useState({ n: 0, transportPct: 0, ledPct: 0, triPct: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) setUserRole(profile.role)
      }
    }

    const fetchPublicKpis = async () => {
      try {
        setLoadingStats(true)
        const { data, error } = await supabase.rpc('get_public_landing_kpis')
        if (error) throw error
        const metrics = data?.[0]
        setKpis({
          n: Number(metrics?.response_count || 0),
          transportPct: Number(metrics?.transport_pct || 0),
          ledPct: Number(metrics?.led_pct || 0),
          triPct: Number(metrics?.tri_pct || 0)
        })
      } catch (err) {
        console.error('Erreur lors de la récupération des KPI publics:', err)
        setKpis({ n: 0, transportPct: 0, ledPct: 0, triPct: 0 })
      } finally {
        setLoadingStats(false)
      }
    }

    getInitialSession()
    fetchPublicKpis()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) setUserRole(profile.role)
      } else {
        setUserRole(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUserRole(null)
    navigate('/')
  }

  const piliers = [
    {
      id: '01',
      icon: Bus,
      title: 'Transport & Mobilité',
      tag: 'Déplacements',
      summary: 'Cartographie des modes de transport (bus, marche, covoiturage), temps de trajet et empreinte carbone.',
      detail: 'Analyse fine des distances domicile-campus, des habitudes de mobilité douce et de la viabilité des solutions de transport collectif pour l’ESPA.'
    },
    {
      id: '02',
      icon: Droplets,
      title: 'Budget & Eau',
      tag: 'Ressources',
      summary: 'Évaluation des consommations d’eau potable, accès aux fontaines et budget quotidien alloué.',
      detail: 'Mesure de l’empreinte hydrique individuelle, disponibilité des points d’eau propre sur le campus et répartition des charges essentielles.'
    },
    {
      id: '03',
      icon: Utensils,
      title: 'Alimentation & Restauration',
      tag: 'Nutrition',
      summary: 'Diagnostic des repas pris sur place, friandises et options de restauration universitaire.',
      detail: 'Étude des régimes alimentaires, du coût moyen du déjeuner et des attentes en matière de qualité nutritionnelle à la cantine.'
    },
    {
      id: '04',
      icon: Laptop,
      title: 'Technologie & Réseaux',
      tag: 'Numérique',
      summary: 'État des équipements informatiques personnels, connectivité Wi-Fi et usages académiques.',
      detail: 'Identification des besoins en infrastructures réseau, accès aux ordinateurs pour les travaux pratiques et autonomie matérielle.'
    },
    {
      id: '05',
      icon: Shirt,
      title: 'Vêtements & Friperie',
      tag: 'Éco-mode',
      summary: 'Cycle de renouvellement du vestiaire, fréquentation des friperies et habitudes de seconde main.',
      detail: 'Sensibilisation à l’impact de l’industrie textile et promotion des bourses d’échange de vêtements au sein des promotions.'
    },
    {
      id: '06',
      icon: Sparkle,
      title: 'Hygiène & Infrastructures',
      tag: 'Santé & Propreté',
      summary: 'Appréciation de l’état des installations sanitaires, accès aux lavabos et produits d’hygiène.',
      detail: 'Suivi de la qualité de maintenance des blocs sanitaires et satisfaction globale quant à la salubrité des locaux.'
    },
    {
      id: '07',
      icon: Trash2,
      title: 'Gestion des Déchets',
      tag: 'Tri & Recyclage',
      summary: 'Niveau d’implémentation du tri sélectif et pratiques de réduction du plastique à usage unique.',
      detail: 'Comptabilisation des points d’apport volontaire et pistes d’action pour éliminer les décharges sauvages sur le campus.'
    },
    {
      id: '08',
      icon: Compass,
      title: 'Perception du Campus',
      tag: 'Bien-être',
      summary: 'Ressenti général sur le cadre de vie, la sécurité, l’ambiance d’études et la verdure.',
      detail: 'Recueil des suggestions directes des étudiants pour réaménager les espaces communs et instaurer un climat convivial.'
    },
    {
      id: '09',
      icon: Users,
      title: 'Profils & Filières',
      tag: 'Démographie',
      summary: 'Répartition par pôles de génie (Civil, Procédés, GSTI, Géologie) et tranches d’âge.',
      detail: 'Croisement démographique des données pour adapter les réponses aux spécificités de chaque mention et année de diplôme.'
    }
  ]

  const steps = [
    {
      num: '01',
      title: 'Création du profil',
      desc: 'Inscrivez-vous simplement en renseignant votre mention et votre niveau d’études.'
    },
    {
      num: '02',
      title: 'Réponses guidées',
      desc: 'Parcourez le questionnaire interactif étape par étape (environ 5 minutes).'
    },
    {
      num: '03',
      title: 'Traitement anonyme',
      desc: 'Vos données sont cryptées et agrégées sans lien avec votre identité personnelle.'
    },
    {
      num: '04',
      title: 'Restitution & Projets',
      desc: 'L’administration et les délégués s’appuient sur les bilans pour financer les améliorations.'
    }
  ]

  const faqs = [
    {
      question: 'Mes données personnelles sont-elles protégées et anonymes ?',
      answer: 'Oui, l’anonymat est au cœur du dispositif CampusPulse. Aucune donnée nominative n’est associée à vos réponses dans les bilans statistiques transmis à l’administration ou publiés dans les rapports.'
    },
    {
      question: 'Qui est éligible pour remplir le baromètre CampusPulse ?',
      answer: 'L’ensemble des étudiants (de la L1 au Doctorat), des enseignants et du personnel administratif de l’École Supérieure Polytechnique d’Antananarivo (ESPA) peut participer.'
    },
    {
      question: 'Puis-je enregistrer mes réponses et reprendre plus tard ?',
      answer: 'Absolument. Votre avancement dans le questionnaire est sauvegardé en temps réel sur votre compte. Vous pouvez quitter et revenir quand vous le souhaitez.'
    },
    {
      question: 'Comment l’administration utilise-t-elle ces statistiques ?',
      answer: 'Les synthèses visuelles (recharts) fournissent des preuves chiffrées pour planifier la rénovation des sanitaires, installer des points d’eau potable, ou aménager les lignes de transport.'
    }
  ]

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary selection:text-white transition-colors duration-200">
      
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/90 border-b border-text-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3">
            <Logo size="default" />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-text-primary flex items-center">
                Campus<span className="text-primary">Pulse</span>
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#about" className="hover:text-text-primary transition-colors">Mission</a>
            <a href="#piliers" className="hover:text-text-primary transition-colors">Les 9 Piliers</a>
            <a href="#comment-ca-marche" className="hover:text-text-primary transition-colors">Méthode</a>
            <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {!session ? (
              <>
                <Link
                  to="/login"
                  className="btn-press px-4 py-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span>Se connecter</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn-press px-4 py-2 text-sm font-semibold bg-primary hover:bg-blue-600 text-white rounded-md shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>S'inscrire</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={userRole === 'admin' ? '/dashboard' : '/formulaire'}
                  className="btn-press px-4 py-2 text-sm font-semibold bg-primary hover:bg-blue-600 text-white rounded-md shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Mon espace</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-press px-4 py-2 text-sm font-semibold border border-text-secondary/20 text-text-secondary hover:text-danger hover:border-danger/40 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-b border-text-primary/10 px-4 pt-3 pb-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-sm font-medium text-text-secondary">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1">Mission</a>
              <a href="#piliers" onClick={() => setMobileMenuOpen(false)} className="py-1">Les 9 Piliers</a>
              <a href="#comment-ca-marche" onClick={() => setMobileMenuOpen(false)} className="py-1">Méthode</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1">FAQ</a>
            </nav>
            <div className="pt-3 border-t border-text-primary/10 flex flex-col gap-2">
              {!session ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center text-sm font-semibold border border-text-secondary/20 text-text-primary rounded-md flex items-center justify-center gap-2"
                  >
                    <span>Se connecter</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center text-sm font-semibold bg-primary text-white rounded-md flex items-center justify-center gap-2"
                  >
                    <span>S'inscrire</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={userRole === 'admin' ? '/dashboard' : '/formulaire'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center text-sm font-semibold bg-primary text-white rounded-md flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Mon espace</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full py-2.5 px-4 text-center text-sm font-semibold border border-danger/30 text-danger rounded-md flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[calc(100vh-80px)] bg-slate-950 text-white overflow-hidden pt-28 pb-20 flex flex-col items-center justify-between">
        {/* Background Image & Linear Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={espaBg}
            alt="Campus ESPA Antananarivo"
            className="w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.05]"
          />
          {/* Sombre Linear Gradient Overlay */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(180deg, rgba(7, 10, 19, 0.75) 0%, rgba(7, 10, 19, 0.88) 100%)'
            }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Centered Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white mb-6 max-w-3xl mx-auto">
            Ensemble, mesurons l'empreinte de <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              notre campus
            </span>
          </h1>

          {/* Centered Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            CampusPulse est la plateforme engagée de collecte et d'analyse des habitudes environnementales, 
            de mobilité et du cadre de vie des étudiants de l'École Supérieure Polytechnique d'Antananarivo.
          </p>

          {/* Centered CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {!session ? (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto btn-press px-8 py-3.5 bg-primary hover:bg-blue-600 text-white font-semibold text-base rounded-md shadow-lg shadow-primary/25 flex items-center justify-center gap-2.5 transition-all"
                >
                  <span>Participer à l'enquête</span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto btn-press px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 rounded-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Se connecter</span>
                </Link>
              </>
            ) : (
              <Link
                to={userRole === 'admin' ? '/dashboard' : '/formulaire'}
                className="w-full sm:w-auto btn-press px-8 py-3.5 bg-primary hover:bg-blue-600 text-white font-semibold text-base rounded-md shadow-lg shadow-primary/25 flex items-center justify-center gap-2.5 transition-all"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Accéder à mon espace</span>
              </Link>
            )}
          </div>

        </div>

        {/* BANDEAU DES STATISTIQUES */}
        <div className="border-text-primary/10 shadow-sm relative z-20 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

              {/* Middle Live KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mx-auto w-full lg:w-auto flex-1 max-w-4xl">
                
                {/* KPI 1: Taille échantillon n */}
                <div className="p-3 sm:p-4 rounded-md bg-bg/20 border border-text-primary/5 text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-primary">
                    {loadingStats ? '...' : kpis.n}
                  </div>
                  <div className="text-xs font-medium mt-0.5">
                    Réponses enregistrées (n)
                  </div>
                </div>

                {/* KPI 2: Mobilité douce / Transport collectif */}
                <div className="p-3 sm:p-4 rounded-md bg-bg/20 border border-text-primary/5 text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-500">
                    {loadingStats ? '...' : `${kpis.transportPct}%`}
                  </div>
                  <div className="text-xs font-medium mt-0.5">
                    Mobilité collective / à pied
                  </div>
                </div>

                {/* KPI 3: Ampoules LED & Éco-gestes */}
                <div className="p-3 sm:p-4 rounded-md bg-bg/20 border border-text-primary/5 text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-500">
                    {loadingStats ? '...' : `${kpis.ledPct}%`}
                  </div>
                  <div className="text-xs font-medium mt-0.5">
                    Utilisent des LED
                  </div>
                </div>

                {/* KPI 4: Pratique du tri sélectif */}
                <div className="p-3 sm:p-4 rounded-md bg-bg/20 border border-text-primary/5 text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500">
                    {loadingStats ? '...' : `${kpis.triPct}%`}
                  </div>
                  <div className="text-xs font-medium mt-0.5">
                    Pratiquent le tri / recyclage
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* MAIN SECTION - SUB-PARTS */}

      {/* SECTION 1: MISSION & CONTEXT (Editorial Split Layout) */}
      <section id="about" className="py-20 bg-surface border-b border-text-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left sticky column */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                01 / Notre Mission
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-snug">
                Un outil décisionnel au service du campus polytechnique.
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                CampusPulse a été conçu pour substituer les rumeurs par des données chiffrées rigoureuses sur les conditions de vie et les enjeux environnementaux à l’ESPA.
              </p>
            </div>

            {/* Right content column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-l-2 border-primary/80 pl-6 py-2 space-y-2">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary shrink-0" />
                  <span>Diagnostic factuel & quantitatif</span>
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Cartographie des flux de transport, suivi des dépenses énergétiques et analyse des consommations d'eau au sein des blocs pédagogiques et résidentiels.
                </p>
              </div>

              <div className="border-l-2 border-secondary/80 pl-6 py-2 space-y-2">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary shrink-0" />
                  <span>Démarche participative et inclusive</span>
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Chaque étudiant, des filières BTP à la Télécommunication en passant par le Génie Chimique et la Géologie, apporte sa voix.
                </p>
              </div>

              <div className="border-l-2 border-emerald-500/80 pl-6 py-2 space-y-2">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Feuille de route éco-responsable</span>
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Priorisation des actions concrètes : tri sélectif, création de points d'eau potable et soutien aux initiatives d'éco-mode étudiante.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: LES 9 PILIERS (Interactive Category Showcase) */}
      <section id="piliers" className="py-20 bg-bg border-b border-text-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">
                02 / Thématiques mesurées
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                Les 9 Piliers du Baromètre ESPA
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md">
              Un questionnaire structuré couvrant l’ensemble de la vie étudiante et des infrastructures.
            </p>
          </div>

          {/* Interactive Category Selector & View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* List selector */}
            <div className="lg:col-span-5 space-y-2">
              {piliers.map((pilier, idx) => {
                const IconComponent = pilier.icon
                const isSelected = activePilier === idx
                return (
                  <button
                    key={pilier.id}
                    onClick={() => setActivePilier(idx)}
                    className={`w-full text-left p-4 rounded-md transition-all flex items-center justify-between border hover:cursor-pointer ${
                      isSelected
                        ? 'bg-surface border-primary/50 text-text-primary shadow-sm'
                        : 'bg-transparent border-transparent text-text-secondary hover:bg-surface/50 hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-text-secondary">
                        {pilier.id}
                      </span>
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} />
                      <span className="text-sm font-bold">{pilier.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-primary translate-x-1' : 'opacity-30'}`} />
                  </button>
                )
              })}
            </div>

            {/* Active Pilier Display Card */}
            <div className="lg:col-span-7 bg-surface border border-text-primary/10 rounded-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-text-primary/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary">
                    Axe #{piliers[activePilier].id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                    {piliers[activePilier].tag}
                  </span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
                {piliers[activePilier].title}
              </h3>

              <p className="text-sm sm:text-base text-text-primary leading-relaxed font-medium">
                {piliers[activePilier].summary}
              </p>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg p-4 rounded border border-text-primary/5">
                {piliers[activePilier].detail}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-text-secondary">
                <span>Inclus dans le formulaire standard</span>
                <Link to={session ? "/formulaire" : "/signup"} className="font-semibold text-primary hover:underline flex items-center gap-1">
                  <span>Répondre à cette section</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: COMMENT ÇA MARCHE (Horizontal Process Stepper) */}
      <section id="comment-ca-marche" className="py-20 bg-surface border-b border-text-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              03 / Méthodologie
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Comment fonctionne le processus ?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Quatre étapes simples garantissant la fiabilité des résultats et l’anonymat des données.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-bg border border-text-primary/10 space-y-4">
                <div className="font-mono text-2xl font-extrabold text-primary">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-text-primary">{step.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: POUR QUI ? (Dual Perspective Split Panel) */}
      <section className="py-20 bg-bg border-b border-text-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              04 / Utilisateurs & Bénéfices
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Une valeur mesurable pour chaque acteur de l'ESPA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Étudiants Panel */}
            <div className="p-8 rounded-lg bg-surface border border-text-primary/10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-primary/10 text-primary">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Pour les Étudiants</h3>
              </div>

              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>Faire remonter les problèmes d'infrastructures et de transports.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>Participer aux projets de seconde main et de réduction des coûts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>Obtenir des preuves chiffrées pour appuyer les demandes des délégués.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/signup"
                  className="btn-press inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <span>Créer mon profil étudiant</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Admin Panel */}
            <div className="p-8 rounded-lg bg-surface border border-text-primary/10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-500">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Pour l'Administration & Chercheurs</h3>
              </div>

              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Accéder à un tableau de bord analytique par pôles et filières.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Prioriser les investissements matériels sur la base de données fiables.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Exporter des bilans synthétiques pour les partenaires académiques.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="btn-press inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:underline"
                >
                  <span>Se connecter à l'espace décisionnel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: FAQ (Minimal Accordion) */}
      <section id="faq" className="py-20 bg-surface border-b border-text-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              05 / Réponses rapides
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Foire aux questions
            </h2>
          </div>

          <div className="divide-y divide-text-primary/10 border-t border-b border-text-primary/10">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left font-semibold text-text-primary flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-text-secondary shrink-0 transition-transform duration-200 ${activeFaq === index ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {activeFaq === index && (
                  <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: BANNIÈRE CTA FINAL */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" >
          <div className="bg-slate-950 text-white rounded-lg p-8 sm:p-12 text-center relative overflow-hidden border border-slate-800 shadow-2xl bg-cover bg-center" 
            style={{
              backgroundImage: `
                linear-gradient(180deg, rgba(7, 10, 19, 0.75) 0%, rgba(7, 10, 19, 0.88) 100%),
                url('${espaBg1}')
              `,
          }}>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Faites entendre votre voix à l'ESPA dès aujourd'hui.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Le remplissage du questionnaire ne prend que quelques minutes et contribue directement aux projets d'amélioration du campus.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                {!session ? (
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto btn-press px-8 py-3 bg-primary hover:bg-blue-600 text-white font-semibold text-sm rounded-md shadow-md flex items-center justify-center gap-2"
                  >
                    <span>S'inscrire</span>
                  </Link>
                ) : (
                  <Link
                    to={userRole === 'admin' ? '/dashboard' : '/formulaire'}
                    className="w-full sm:w-auto btn-press px-8 py-3 bg-primary hover:bg-blue-600 text-white font-semibold text-sm rounded-md shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Accéder à mon espace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Simple footer adheres strictly to user prompt & specifications) */}
      <footer className="bg-surface border-t border-text-primary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 text-left">
            
            {/* Logo + 1-sentence description */}
            <div className="flex flex-col items-start max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <Logo size="small" />
                <span className="font-bold text-lg text-text-primary tracking-tight">
                  Campus<span className="text-primary">Pulse</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                CampusPulse est la plateforme d'évaluation et d'analyse de la vie campus et de la durabilité à l'École Supérieure Polytechnique d'Antananarivo.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col justify-center gap-1.5 text-xs sm:text-sm font-medium text-text-secondary">
              <p className="font-bold text-lg text-text-primary">Liens utiles</p>
              <a href="#about" className="hover:text-text-primary transition-colors">Mission</a>
              <a href="#piliers" className="hover:text-text-primary transition-colors">Les 9 Piliers</a>
              <a href="#comment-ca-marche" className="hover:text-text-primary transition-colors">Méthode</a>
              <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
              {!session ? (
                <>
                  <Link to="/login" className="hover:text-text-primary transition-colors">Se connecter</Link>
                  <Link to="/signup" className="hover:text-text-primary transition-colors">S'inscrire</Link>
                </>
              ) : (
                <Link to="/formulaire" className="hover:text-text-primary transition-colors">Mon espace</Link>
              )}
            </div>

            {/* Developer link */}
            <div className="flex flex-col items-start text-xs text-text-secondary space-y-1">
              <div>
                Développé avec <span className="text-danger">❤️</span> par{' '}
                <a
                  href="https://rommy.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>rommy.dev</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <span className="text-[11px] text-text-secondary/70">
                © {new Date().getFullYear()} CampusPulse — ESPA
              </span>
            </div>

          </div>
        </div>
      </footer>

    </div>
  )
}

export default Landing
