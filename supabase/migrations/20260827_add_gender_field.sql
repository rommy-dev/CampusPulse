-- ============================================
-- Ajout du champ genre pour les profils utilisateurs
-- ============================================

-- Ajouter la colonne genre avec contrainte de validation
alter table public.profiles
  add column genre text 
  check (genre in ('Masculin', 'Féminin'));
