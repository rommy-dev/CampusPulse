-- ============================================
-- CampusPulse - Schema initial
-- Tables: profiles, responses + RLS policies
-- ============================================

-- 1. Table profiles (etend auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'etudiant' check (role in ('etudiant', 'admin')),
  created_at timestamptz not null default now()
);

-- 2. Fonction + trigger : auto-creation du profil a l'inscription
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'etudiant');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Table responses (une seule soumission par etudiant)
create table public.responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

-- 4. Activation de la Row Level Security
alter table public.profiles enable row level security;
alter table public.responses enable row level security;

-- 5. Policies profiles
create policy "Un utilisateur voit son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

-- 6. Policies responses
create policy "Un utilisateur cree sa propre reponse"
  on public.responses for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur voit sa propre reponse"
  on public.responses for select
  using (auth.uid() = user_id);

create policy "Un admin voit toutes les reponses"
  on public.responses for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
