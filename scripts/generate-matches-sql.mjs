// Fetches World Cup 2026 fixtures from openfootball and generates seed SQL
const res = await fetch(
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
)
const data = await res.json()

function parseMatchDate(date, time) {
  const [timePart, tzPart] = time.split(' ')
  const [h, m] = timePart.split(':').map(Number)
  const utcOffset = parseInt(tzPart.replace('UTC', ''))
  const d = new Date(date + 'T00:00:00Z')
  d.setUTCHours(h - utcOffset)
  d.setUTCMinutes(m)
  return d.toISOString()
}

function normalizeRound(round, group) {
  if (group || round.startsWith('Matchday')) return 'Fase de grupos'
  if (round === 'Round of 32') return 'Dieciseisavos'
  if (round === 'Round of 16') return 'Octavos'
  if (round === 'Quarter-final') return 'Cuartos'
  if (round === 'Semi-final') return 'Semifinales'
  if (round === 'Match for third place') return 'Tercer puesto'
  if (round === 'Final') return 'Final'
  return round
}

function externalId(match, index) {
  if (match.num) return `match-${match.num}`
  return `${match.date}-${match.team1}-${match.team2}`.toLowerCase().replace(/\s+/g, '-')
}

function escape(str) {
  return str ? str.replace(/'/g, "''") : ''
}

const lines = [
  '-- World Cup 2026 match fixtures',
  '-- Generated from openfootball/worldcup.json',
  '-- Safe to re-run: uses upsert on external_id',
  '',
  'insert into matches (external_id, home_team, away_team, match_date, round, group_stage) values',
]

const rows = data.matches.map((m, i) => {
  const date = parseMatchDate(m.date, m.time)
  const round = normalizeRound(m.round, m.group)
  const group = m.group ? `'${escape(m.group)}'` : 'null'
  const extId = externalId(m, i)
  return `  ('${escape(extId)}', '${escape(m.team1)}', '${escape(m.team2)}', '${date}', '${escape(round)}', ${group})`
})

lines.push(rows.join(',\n'))
lines.push('on conflict (external_id) do update set')
lines.push('  home_team = excluded.home_team,')
lines.push('  away_team = excluded.away_team,')
lines.push('  match_date = excluded.match_date,')
lines.push('  round = excluded.round,')
lines.push('  group_stage = excluded.group_stage;')
lines.push('')
lines.push(`-- Total: ${rows.length} matches`)

console.log(lines.join('\n'))
