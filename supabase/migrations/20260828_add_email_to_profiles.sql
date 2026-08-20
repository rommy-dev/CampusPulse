-- ============================================
-- CampusPulse - Ajout email dans profiles avec synchronisation
-- ============================================

-- 1. Ajouter la colonne email à la table profiles
alter table public.profiles
add column if not exists email text;

-- 2. Créer une fonction pour synchroniser l'email depuis auth.users
create or replace function public.sync_user_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles
    set email = new.email
    where id = new.id;
  end if;
  return new;
end;
$$;

-- 3. Créer un trigger pour mettre à jour l'email quand il change dans auth.users
drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute function public.sync_user_email();

-- 4. Backfill: copier les emails existants depuis auth.users vers profiles
update public.profiles
set email = au.email
from auth.users au
where profiles.id = au.id
and profiles.email is null;

-- 5. Supprimer l'ancienne fonction et trigger de création d'utilisateur
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 6. Créer une nouvelle fonction pour synchroniser l'email à la création d'utilisateur
create or replace function public.sync_new_user_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'etudiant')
  on conflict (id) do update set
    email = new.email;
  return new;
end;
$$;

-- 7. Créer le nouveau trigger pour la création d'utilisateur
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.sync_new_user_email();