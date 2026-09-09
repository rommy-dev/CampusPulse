-- Expose uniquement les indicateurs agrégés nécessaires à la page d'accueil.
-- Les réponses individuelles restent protégées par les politiques RLS de `responses`.
create or replace function public.get_public_landing_kpis()
returns table (
  response_count bigint,
  transport_pct integer,
  led_pct integer,
  tri_pct integer
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)::bigint as response_count,
    coalesce(round(100.0 * count(*) filter (
      where answers ->> 'transport_principal' in ('taxi_be', 'pied', 'covoiturage', 'velo_moto_deux_roues')
    ) / nullif(count(*), 0)), 0)::integer as transport_pct,
    coalesce(round(100.0 * count(*) filter (
      where answers ->> 'led_utilise' = 'oui'
    ) / nullif(count(*), 0)), 0)::integer as led_pct,
    coalesce(round(100.0 * count(*) filter (
      where nullif(answers ->> 'pratique_tri_selectif', '') is not null
        and answers ->> 'pratique_tri_selectif' <> 'jamais'
    ) / nullif(count(*), 0)), 0)::integer as tri_pct
  from public.responses;
$$;

grant execute on function public.get_public_landing_kpis() to anon, authenticated;
