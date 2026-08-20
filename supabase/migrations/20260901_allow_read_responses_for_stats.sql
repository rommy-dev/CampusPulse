-- ============================================
-- CampusPulse - Allow authenticated users to select responses for statistics
-- ============================================

drop policy if exists "Un utilisateur voit sa propre reponse" on public.responses;

create policy "Tous les utilisateurs authentifies voient les reponses pour les statistiques"
  on public.responses for select
  using (auth.role() = 'authenticated');
