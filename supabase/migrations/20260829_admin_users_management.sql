-- ============================================
-- CampusPulse - Gestion admin des utilisateurs
-- Politiques RLS pour admin + fonction de suppression
-- ============================================

-- 1. Politique pour permettre aux admins de voir tous les profils
drop policy if exists "Un admin voit tous les profils" on public.profiles;
create policy "Un admin voit tous les profils"
on public.profiles for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- 2. Politique pour permettre aux admins de modifier n'importe quel profil
--    (y compris le rôle et l'email)
drop policy if exists "Un admin modifie tous les profils" on public.profiles;
create policy "Un admin modifie tous les profils"
on public.profiles for update
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- 3. Politique pour permettre aux admins de supprimer des profils
drop policy if exists "Un admin supprime les profils" on public.profiles;
create policy "Un admin supprime les profils"
on public.profiles for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- 4. Fonction RPC pour supprimer un utilisateur et son profil
--    Cette fonction supprime le profil
--    Note: La suppression complète de auth.users nécessite le service role key
--    qui n'est pas disponible dans les fonctions RPC standard
--    Pour une suppression complète, utiliser l'API admin Supabase ou le dashboard
create or replace function public.delete_user_and_profile(user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  -- Vérifier que l'utilisateur appelant est admin
  select role into user_role
  from public.profiles
  where id = auth.uid();
  
  if user_role != 'admin' then
    raise exception 'Seuls les admins peuvent supprimer des utilisateurs';
  end if;
  
  -- Supprimer le profil
  delete from public.profiles where id = user_id;
  
  -- Note: L'utilisateur auth.users restera dans la base
  -- Pour le supprimer complètement, utiliser:
  -- - Supabase Dashboard > Authentication > Users
  -- - Ou l'API admin avec service role key
end;
$$;

-- 5. Accorder l'exécution de la fonction aux utilisateurs authentifiés
grant execute on function public.delete_user_and_profile(uuid) to authenticated;