-- ============================================
-- Fix des politiques Storage pour les avatars
-- ============================================

-- Politique SELECT : lecture publique des avatars (bucket marqué public)
create policy "Avatars publics en lecture"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- S'assurer que les politiques d'écriture existent et sont correctes
drop policy if exists "Un utilisateur televerse son propre avatar" on storage.objects;
create policy "Un utilisateur televerse son propre avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Un utilisateur met a jour son propre avatar" on storage.objects;
create policy "Un utilisateur met a jour son propre avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
