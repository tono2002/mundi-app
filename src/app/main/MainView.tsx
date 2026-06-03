'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getFlagCode } from '@/lib/flags'
import { Search, X, Settings, Building2, User, MapPin, Phone, Star, Navigation, Map } from 'lucide-react'
import Flag from '@/components/ui/Flag'
import type { Match } from '@/types'
import type { MapBar } from '@/components/map/MapComponent'

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#eaf0ea] flex items-center justify-center">
      <p className="text-sm text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

interface BarFromDB {
  id: string
  name: string
  description: string | null
  address: string | null
  phone: string | null
  lat: number
  lng: number
  bar_matches: { match_id: string }[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('es', { day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
  }
}

function isPlaceholder(team: string) {
  return /^[WL]\d+$/.test(team)
}

export default function MainView({ matches, bars }: { matches: Match[]; bars: BarFromDB[] }) {
  const [favTeam, setFavTeam] = useState('')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [selectedBar, setSelectedBar] = useState<MapBar | null>(null)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('mundi_fav_team')
    if (stored) setFavTeam(stored)
  }, [])

  const displayMatches = useMemo(() => {
    const filtered = matches.filter((m) => {
      if (!search) return true
      const q = search.toLowerCase()
      return m.home_team.toLowerCase().includes(q) || m.away_team.toLowerCase().includes(q)
    })
    return [...filtered].sort((a, b) => {
      const aFav = !!favTeam && (a.home_team === favTeam || a.away_team === favTeam)
      const bFav = !!favTeam && (b.home_team === favTeam || b.away_team === favTeam)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      return new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
    })
  }, [matches, search, favTeam])

  const visibleBars = useMemo<MapBar[]>(() => {
    if (!selectedMatch) return []
    return bars
      .filter((b) => b.bar_matches.some((bm) => bm.match_id === selectedMatch.id))
      .map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        address: b.address,
        phone: b.phone,
        lat: b.lat,
        lng: b.lng,
      }))
  }, [bars, selectedMatch])

  function selectMatch(match: Match) {
    setSelectedMatch((prev) => (prev?.id === match.id ? null : match))
    setSelectedBar(null)
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">

      {/* ── TOP BAR ── */}
      <div className="relative z-20 flex items-center h-14 bg-white shadow-md px-3 gap-2 shrink-0">
        <Link
          href="/"
          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl hover:bg-green-50 transition-colors"
          title="Inicio"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </Link>

        <div className="w-px h-5 bg-gray-200 shrink-0" />

        {showSearch ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar equipo..."
              className="w-40 sm:w-52 border border-gray-200 rounded-xl px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
            <button
              onClick={() => { setShowSearch(false); setSearch('') }}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="shrink-0 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Buscar</span>
          </button>
        )}

        <div className="w-px h-5 bg-gray-200 shrink-0" />

        {/* Match carousel */}
        <div
          className="flex-1 flex items-center gap-2 overflow-x-auto py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayMatches.map((match) => {
            const isFav = favTeam && (match.home_team === favTeam || match.away_team === favTeam)
            const isSelected = selectedMatch?.id === match.id
            const { time } = formatDate(match.match_date)
            const homeAbbr = isPlaceholder(match.home_team) ? '???' : match.home_team.slice(0, 3).toUpperCase()
            const awayAbbr = isPlaceholder(match.away_team) ? '???' : match.away_team.slice(0, 3).toUpperCase()
            const barCount = bars.filter((b) =>
              b.bar_matches.some((bm) => bm.match_id === match.id)
            ).length
            return (
              <button
                key={match.id}
                onClick={() => selectMatch(match)}
                className={[
                  'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all',
                  isSelected
                    ? 'bg-green-700 text-white border-green-700 shadow-md'
                    : isFav
                    ? 'bg-green-50 border-green-200 text-gray-800 hover:border-green-400'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300',
                ].join(' ')}
              >
                {isFav && !isSelected && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
                <Flag code={getFlagCode(match.home_team)} className="w-5 h-3.5 rounded-[2px] shrink-0" />
                <span className="font-bold">{homeAbbr}</span>
                <span className={isSelected ? 'text-green-200' : 'text-gray-300'}>vs</span>
                <span className="font-bold">{awayAbbr}</span>
                <Flag code={getFlagCode(match.away_team)} className="w-5 h-3.5 rounded-[2px] shrink-0" />
                <span className={`hidden sm:block ${isSelected ? 'text-green-100' : 'text-gray-400'}`}>{time}</span>
                {barCount > 0 && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                    {barCount}
                  </span>
                )}
              </button>
            )
          })}
          {displayMatches.length === 0 && (
            <span className="text-sm text-gray-400 px-2 shrink-0">Sin resultados</span>
          )}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* MAP — ocupa todo el fondo */}
        <div className="absolute inset-0 z-0">
          <MapComponent
            bars={visibleBars}
            selectedBarId={selectedBar?.id}
            onBarSelect={(bar) => setSelectedBar((prev) => prev?.id === bar.id ? null : bar)}
          />
        </div>

        {/* Overlay: sin partido seleccionado */}
        {!selectedMatch && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shadow-sm">
              <Map className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Selecciona un partido</p>
              <p className="text-xs text-gray-400 mt-0.5">para ver los bares que lo emiten</p>
            </div>
          </div>
        )}

        {/* Partido seleccionado — pill superior */}
        {selectedMatch && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-3 pointer-events-auto">
              <Flag code={getFlagCode(selectedMatch.home_team)} className="w-7 h-5 rounded-sm shrink-0" />
              <div className="text-center">
                <p className="font-bold text-sm text-gray-900 leading-tight">
                  {selectedMatch.home_team} vs {selectedMatch.away_team}
                </p>
                <p className="text-[11px] text-gray-400">
                  {formatDate(selectedMatch.match_date).date} · {formatDate(selectedMatch.match_date).time} · {visibleBars.length} bares
                </p>
              </div>
              <Flag code={getFlagCode(selectedMatch.away_team)} className="w-7 h-5 rounded-sm shrink-0" />
              <button
                onClick={() => { setSelectedMatch(null); setSelectedBar(null) }}
                className="text-gray-300 hover:text-gray-500 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── LEFT SIDEBAR ── */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-[60px] bg-white shadow-md flex flex-col items-center pt-3 pb-4 gap-1">
          <Link href="/login" title="Iniciar sesión como Bar" className="group flex flex-col items-center gap-0.5 w-11 py-2.5 rounded-xl hover:bg-green-50 transition-colors">
            <Building2 className="w-5 h-5 text-gray-400 group-hover:text-green-700" />
            <span className="text-[9px] font-medium text-gray-400 group-hover:text-green-700 leading-tight text-center">Bar</span>
          </Link>
          <Link href="/login?type=fan" title="Iniciar sesión como Fan" className="group flex flex-col items-center gap-0.5 w-11 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
            <User className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            <span className="text-[9px] font-medium text-gray-400 group-hover:text-blue-600 leading-tight text-center">Fan</span>
          </Link>
          <div className="flex-1" />
          <Link href="/" title="Ajustes" className="group flex flex-col items-center gap-0.5 w-11 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-700" />
            <span className="text-[9px] font-medium text-gray-400 group-hover:text-gray-700">Ajustes</span>
          </Link>
        </div>

        {/* ── BAR INFO CARD ── */}
        {selectedBar && (
          <div
            className="absolute bottom-4 z-20 bg-white rounded-2xl shadow-xl overflow-hidden"
            style={{ left: '72px', width: '300px', maxWidth: 'calc(100vw - 88px)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{selectedBar.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{selectedBar.address}</p>
              </div>
              <button onClick={() => setSelectedBar(null)} className="text-gray-300 hover:text-gray-500 ml-2 shrink-0"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {selectedBar.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {selectedBar.phone}
                </div>
              )}
              {selectedBar.description && (
                <p className="text-xs text-gray-500 leading-relaxed">{selectedBar.description}</p>
              )}
              <button className="w-full py-2 bg-green-700 text-white text-xs font-bold rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" /> Cómo llegar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
