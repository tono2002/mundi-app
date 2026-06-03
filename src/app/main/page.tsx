import { createServerSupabaseClient } from '@/lib/supabase-server'
import MainView from './MainView'

export default async function MainPage() {
  const supabase = await createServerSupabaseClient()
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true })

  return <MainView matches={matches ?? []} />
}
