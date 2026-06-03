-- Fix bar_matches INSERT policy: add explicit with check clause
drop policy if exists "Dueño puede gestionar sus bar_matches" on bar_matches;

create policy "Dueño puede leer sus bar_matches"
  on bar_matches for select
  using (auth.uid() = (select owner_id from bars where id = bar_id));

create policy "Dueño puede insertar sus bar_matches"
  on bar_matches for insert
  with check (auth.uid() = (select owner_id from bars where id = bar_id));

create policy "Dueño puede eliminar sus bar_matches"
  on bar_matches for delete
  using (auth.uid() = (select owner_id from bars where id = bar_id));

create policy "Dueño puede actualizar sus bar_matches"
  on bar_matches for update
  using (auth.uid() = (select owner_id from bars where id = bar_id))
  with check (auth.uid() = (select owner_id from bars where id = bar_id));
