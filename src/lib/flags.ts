export const TEAM_FLAGS: Record<string, string> = {
  Algeria: '🇩🇿',
  Argentina: '🇦🇷',
  Australia: '🇦🇺',
  Austria: '🇦🇹',
  Belgium: '🇧🇪',
  'Bosnia & Herzegovina': '🇧🇦',
  Brazil: '🇧🇷',
  Canada: '🇨🇦',
  'Cape Verde': '🇨🇻',
  Colombia: '🇨🇴',
  Croatia: '🇭🇷',
  'Czech Republic': '🇨🇿',
  'DR Congo': '🇨🇩',
  Ecuador: '🇪🇨',
  Egypt: '🇪🇬',
  England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Ghana: '🇬🇭',
  Haiti: '🇭🇹',
  Iran: '🇮🇷',
  Iraq: '🇮🇶',
  'Ivory Coast': '🇨🇮',
  Japan: '🇯🇵',
  Jordan: '🇯🇴',
  Mexico: '🇲🇽',
  Morocco: '🇲🇦',
  Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿',
  Norway: '🇳🇴',
  Panama: '🇵🇦',
  Paraguay: '🇵🇾',
  Portugal: '🇵🇹',
  Qatar: '🇶🇦',
  'Saudi Arabia': '🇸🇦',
  Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  Senegal: '🇸🇳',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  Spain: '🇪🇸',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  Tunisia: '🇹🇳',
  Turkey: '🇹🇷',
  USA: '🇺🇸',
  Uruguay: '🇺🇾',
  Uzbekistan: '🇺🇿',
}

export function getFlag(team: string): string {
  return TEAM_FLAGS[team] ?? ''
}

const TEAM_CODES: Record<string, string> = {
  Algeria: 'DZ', Argentina: 'AR', Australia: 'AU', Austria: 'AT',
  Belgium: 'BE', Brazil: 'BR', Canada: 'CA', Colombia: 'CO',
  Croatia: 'HR', Ecuador: 'EC', Egypt: 'EG', England: 'GB',
  France: 'FR', Germany: 'DE', Ghana: 'GH', Iran: 'IR',
  Iraq: 'IQ', Japan: 'JP', Mexico: 'MX', Morocco: 'MA',
  Netherlands: 'NL', Norway: 'NO', Panama: 'PA', Paraguay: 'PY',
  Portugal: 'PT', Qatar: 'QA', Senegal: 'SN', 'South Korea': 'KR',
  Spain: 'ES', Sweden: 'SE', Switzerland: 'CH', Tunisia: 'TN',
  Turkey: 'TR', USA: 'US', Uruguay: 'UY', Uzbekistan: 'UZ',
  'Saudi Arabia': 'SA', 'Ivory Coast': 'CI', 'DR Congo': 'CD',
  'South Africa': 'ZA', 'New Zealand': 'NZ', 'Cape Verde': 'CV',
  'Czech Republic': 'CZ', Haiti: 'HT', Jordan: 'JO',
  'Bosnia & Herzegovina': 'BA', Scotland: 'GB',
}

export function getFlagCode(team: string): string {
  return TEAM_CODES[team] ?? ''
}

export function formatMatchDate(isoString: string): { date: string; time: string } {
  const d = new Date(isoString)
  const date = d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}
