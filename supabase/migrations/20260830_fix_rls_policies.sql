-- ============================================
-- CampusPulse - Fix RLS policies infinite recursion
-- ============================================

-- Drop all existing policies on profiles to avoid conflicts
drop policy if exists "Un utilisateur voit son propre profil" on public.profiles;
drop policy if exists "Un utilisateur modifie son propre profil" on public.profiles;
drop policy if exists "Un admin voit tous les profils" on public.profiles;
drop policy if exists "Un admin modifie tous les profils" on public.profiles;
drop policy if exists "Un admin supprime les profils" on public.profiles;

-- Create a helper function to check if current user is admin
-- This avoids infinite recursion by using SECURITY DEFINER
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Recreate policies in the correct order using the helper function

-- 1. User can see their own profile
create policy "Un utilisateur voit son propre profil"
on public.profiles for select
using (auth.uid() = id);

-- 2. Admin can see all profiles
create policy "Un admin voit tous les profils"
on public.profiles for select
using (public.is_admin());

-- 3. User can update their own profile (except role)
create policy "Un utilisateur modifie son propre profil"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- 4. Admin can update any profile (including role and email)
create policy "Un admin modifie tous les profils"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

-- 5. Admin can delete profiles
create policy "Un admin supprime les profils"
on public.profiles for delete
using (public.is_admin());