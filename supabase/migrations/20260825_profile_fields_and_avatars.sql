-- ============================================
-- CampusPulse - Profil utilisateur + avatars
-- ============================================

-- 1. Nouvelles colonnes sur profiles
alter table public.profiles
  add column nom text,
  add column prenom text,
  add column date_naissance date,
  add column filiere text,
  add column annee_universitaire text,
  add column avatar_url text;

-- 2. Policy UPDATE (manquante jusqu'ici : on ne pouvait que lire)
create policy "Un utilisateur modifie son propre profil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Empeche un etudiant de modifier son propre role via l'API
--    (le role ne pourra plus etre change que depuis le Dashboard/SQL Editor)
revoke update (role) on public.profiles from authenticated;

-- 4. Bucket Storage pour les avatars (public en lecture)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 5. Policies Storage : chaque utilisateur ne peut ecrire que dans son propre dossier
--    Chemin attendu : {user_id}/avatar
create policy "Un utilisateur televerse son propre avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Un utilisateur met a jour son propre avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
