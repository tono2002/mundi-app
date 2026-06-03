export type Bar = {
  id: string
  name: string
  description: string
  address: string
  lat: number
  lng: number
  phone?: string
  website?: string
  photos: string[]
  owner_id: string
  created_at: string
}

export type Match = {
  id: string
  home_team: string
  away_team: string
  match_date: string
  group_stage?: string
  round: string
}

export type BarMatch = {
  id: string
  bar_id: string
  match_id: string
  comments?: string
  special_offer?: string
  bar?: Bar
  match?: Match
}
