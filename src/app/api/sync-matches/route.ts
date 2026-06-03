import { createClient } from '@supabase/supabase-js'

const OPENFOOTBALL_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

interface RawMatch {
  round: string
  num?: number
  date: string
  time: string
  team1: string
  team2: string
  group?: string
}

function parseMatchDate(date: string, time: string): string {
  const [timePart, tzPart] = time.split(' ')
  const [h, m] = timePart.split(':').map(Number)
  const utcOffset = parseInt(tzPart.replace('UTC', ''))
  const d = new Date(date + 'T00:00:00Z')
  d.setUTCHours(h - utcOffset)
  d.setUTCMinutes(m)
  return d.toISOString()
}

function normalizeRound(round: string, group?: string): string {
  if (group || round.startsWith('Matchday')) return 'Fase de grupos'
  if (round === 'Round of 32') return 'Dieciseisavos'
  if (round === 'Round of 16') return 'Octavos'
  if (round === 'Quarter-final') return 'Cuartos'
  if (round === 'Semi-final') return 'Semifinales'
  if (round === 'Match for third place') return 'Tercer puesto'
  if (round === 'Final') return 'Final'
  return round
}

function externalId(match: RawMatch): string {
  if (match.num) return `match-${match.num}`
  return `${match.date}-${match.team1}-${match.team2}`.toLowerCase().replace(/\s+/g, '-')
}

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.SYNC_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const res = await fetch(OPENFOOTBALL_URL, { cache: 'no-store' })
  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch fixtures' }, { status: 502 })
  }

  const data = await res.json()
  const matches = (data.matches as RawMatch[]).map((m) => ({
    external_id: externalId(m),
    home_team: m.team1,
    away_team: m.team2,
    match_date: parseMatchDate(m.date, m.time),
    round: normalizeRound(m.round, m.group),
    group_stage: m.group ?? null,
  }))

  const { error, count } = await supabase
    .from('matches')
    .upsert(matches, { onConflict: 'external_id', count: 'exact' })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ synced: count, total: matches.length })
}
