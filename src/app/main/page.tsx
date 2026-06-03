import { createServerSupabaseClient } from '@/lib/supabase-server'
import MainView from './MainView'

export default async function MainPage() {
  const supabase = await createServerSupabaseClient()

  const [{ data: matches }, { data: bars }] = await Promise.all([
    supabase.from('matches').select('*').order('match_date', { ascending: true }),
    supabase
      .from('bars')
      .select('id, name, description, address, phone, lat, lng, bar_matches(match_id)')
      .not('lat', 'is', null)
      .not('lng', 'is', null),
  ])

  return <MainView matches={matches ?? []} bars={bars ?? []} />
}
