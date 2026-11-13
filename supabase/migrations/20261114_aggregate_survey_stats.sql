-- ============================================
-- CampusPulse - Statistiques agrégées côté serveur
-- ============================================
-- Avant : tout utilisateur connecté pouvait lire les réponses brutes de la table
-- `responses` (date de naissance, âge exact, genre, filière, année…), car la page
-- Statistiques calculait les graphiques dans le navigateur.
-- Après : un étudiant ne lit que sa propre réponse ; la page Statistiques reçoit
-- uniquement des comptages par question, calculés ici.

-- 1. Retirer la lecture de toutes les réponses par tout utilisateur connecté
drop policy if exists "Tous les utilisateurs authentifies voient les reponses pour les statistiques"
  on public.responses;

-- 2. Lecture limitée : sa propre réponse (vérification « déjà répondu »), ou admin
drop policy if exists "Un utilisateur voit sa propre reponse" on public.responses;
create policy "Un utilisateur voit sa propre reponse"
  on public.responses for select
  using (auth.uid() = user_id);

drop policy if exists "Un admin voit toutes les reponses" on public.responses;
create policy "Un admin voit toutes les reponses"
  on public.responses for select
  using (public.is_admin());

-- 3. Comptages par question, sans aucune réponse individuelle.
-- Seules les questions affichées dans la page Statistiques sont exposées (liste
-- blanche) : pas de date de naissance, d'âge exact, de filière, d'année
-- universitaire ni de texte libre.
-- Format : { "n": 22, "counts": { "genre": { "Masculin": 12, ... }, ... } }
-- Les choix multiples (tableaux) sont comptés élément par élément ; les booléens
-- sont renvoyés sous la forme "true" / "false".
create or replace function public.get_survey_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with allowed(key) as (
    select unnest(array[
      'acces_eau_potable',
      'alimentation_equilibree',
      'budget_couvre_besoins',
      'budget_mensuel_total',
      'combine_transports',
      'connait_principes_chimie_verte',
      'connait_toxicite_combustion_plastiques',
      'consommation_viande_poisson',
      'coupures_frequentes',
      'depense_alimentation_jour',
      'depense_transport_jour',
      'devenir_vetements_usages',
      'difficultes_transport',
      'duree_trajet',
      'duree_utilisation_appareil',
      'elimination_equipements_electroniques',
      'energie_cuisson',
      'equipements_numeriques',
      'eteint_lumieres_debranche',
      'favorable_ateliers_ecologiques',
      'frequence_collation',
      'frequence_renouvellement_vetements',
      'fruits_legumes_locaux_saison',
      'genre',
      'gestion_restes_alimentaires',
      'led_utilise',
      'lessive_ecologique_utilisee',
      'lieu_elimination_dechets',
      'lieu_repas_principaux',
      'lit_etiquettes_produits',
      'loyer_mensuel',
      'methode_lavage_vetements',
      'nombre_repas_jour',
      'nombre_tenues_semaine',
      'nombre_tenutes_semaine',
      'origine_achat_vetements',
      'perception_urgence_dechets',
      'possede_fibres_naturelles_locales',
      'postes_depenses',
      'poubelles_suffisantes_campus',
      'pratiques_economie_eau',
      'pratique_tri_selectif',
      'pret_a_participer_actions_environnementales',
      'procedes_locaux_durables',
      'produits_chimiques_utilises',
      'produits_plastique_usage_unique',
      'reaction_panne_appareil',
      'recharge_appareils_plusieurs_fois_nuit',
      'repare_vetements',
      'residence_principale',
      'revend_bouteilles_metaux_collecteurs',
      'sechage_exterieur',
      'source_approvisionnement_alimentaire',
      'source_financement',
      'tranche_age',
      'transport_principal',
      'types_dechets_produits',
      'utilise_contenants_reutilisables'
    ])
  ),
  answer_values as (
    select kv.key, v.value
    from public.responses r
    cross join lateral jsonb_each(r.answers) as kv(key, value)
    join allowed a on a.key = kv.key
    cross join lateral (
      select elem #>> '{}' as value
      from jsonb_array_elements(
        case when jsonb_typeof(kv.value) = 'array' then kv.value else jsonb_build_array(kv.value) end
      ) as elem
      where jsonb_typeof(elem) <> 'null' and nullif(elem #>> '{}',
      '') is not null
    ) as v
  ),
  per_value as (
    select key, value, count(*) as c
    from answer_values
    group by key, value
  ),
  per_key as (
    select key, jsonb_object_agg(value, c) as counts
    from per_value
    group by key
  )
  select jsonb_build_object(
    'n', (select count(*) from public.responses),
      'counts', coalesce((select jsonb_object_agg(key, counts) from per_key),
      '{}'::jsonb)
  );
$$;

revoke all on function public.get_survey_stats() from public, anon;
grant execute on function public.get_survey_stats() to authenticated;
