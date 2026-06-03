'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import type { Match } from '@/types'

const DEMO_BARS = [
  { id: 1, name: 'Bar El Gol', address: 'Fuencarral 43, Madrid', phone: '+34 91 123 45 67', description: 'El bar más futbolero del barrio. Pantallas gigantes y cerveza fría.', offer: '🍺 2x1 en cervezas durante partidos de España', top: '40%', left: '42%' },
  { id: 2, name: 'Cervecería Sport', address: 'Gran Vía 24, Madrid', phone: '+34 91 234 56 78', description: 'Terraza interior, 6 pantallas y carta de cervezas artesanas.', offer: '🌮 Nachos gratis con cada ronda', top: '55%', left: '57%' },
  { id: 3, name: 'Peña Madridista', address: 'Alcalá 100, Madrid', phone: '+34 91 345 67 89', description: 'La peña de toda la vida. Ambiente único y precios imbatibles.', offer: null, top: '33%', left: '62%' },
]

type Bar = typeof DEMO_BARS[0]

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

export default function MainView({ matches }: { matches: Match[] }) {
  const [favTeam, setFavTeam] = useState('')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null)
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

    // Sort: closest date first, but if fav team has a match push it to front
    return [...filtered].sort((a, b) => {
      const aFav = favTeam && (a.home_team === favTeam || a.away_team === favTeam)
      const bFav = favTeam && (b.home_team === favTeam || b.away_team === favTeam)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      return new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
    })
  }, [matches, search, favTeam])

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
          <span className="text-xl">⚽</span>
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
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl leading-none rounded-lg hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="shrink-0 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
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
                {isFav && !isSelected && <span>⭐</span>}
                <span className="text-base">{getFlag(match.home_team)}</span>
                <span className="font-bold">{homeAbbr}</span>
                <span className={isSelected ? 'text-green-200' : 'text-gray-300'}>vs</span>
                <span className="font-bold">{awayAbbr}</span>
                <span className="text-base">{getFlag(match.away_team)}</span>
                <span className={`hidden sm:block ${isSelected ? 'text-green-100' : 'text-gray-400'}`}>{time}</span>
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

        {/* MAP */}
        <div className="absolute inset-0 z-0 bg-[#eaf0ea]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right,#5a8a6a 1px,transparent 1px),linear-gradient(to bottom,#5a8a6a 1px,transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(to right,#5a8a6a 1px,transparent 1px),linear-gradient(to bottom,#5a8a6a 1px,transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute top-[30%] left-[15%] w-[70%] h-2 bg-white/60 rounded-full rotate-3" />
          <div className="absolute top-[50%] left-[10%] w-[80%] h-1.5 bg-white/50 rounded-full -rotate-1" />
          <div className="absolute top-[20%] left-[50%] w-1.5 h-[60%] bg-white/50 rounded-full rotate-2" />
          <div className="absolute top-[15%] left-[30%] w-1 h-[70%] bg-white/40 rounded-full" />

          {!selectedMatch && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shadow-sm">
                <p className="text-3xl mb-2">🗺️</p>
                <p className="text-sm font-semibold text-gray-700">Selecciona un partido</p>
                <p className="text-xs text-gray-400 mt-0.5">para ver los bares que lo emiten</p>
              </div>
            </div>
          )}

          {selectedMatch &&
            DEMO_BARS.map((bar) => (
              <button
                key={bar.id}
                onClick={() => setSelectedBar(bar)}
                style={{ top: bar.top, left: bar.left }}
                className={[
                  'absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95',
                  selectedBar?.id === bar.id
                    ? 'bg-green-800 text-white ring-2 ring-white scale-105'
                    : 'bg-green-700 text-white hover:bg-green-800',
                ].join(' ')}
              >
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
                {bar.name}
              </button>
            ))}

          {selectedMatch && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-lg px-4 py-2 flex items-center gap-3 pointer-events-auto">
                <span className="text-xl">{getFlag(selectedMatch.home_team)}</span>
                <div className="text-center">
                  <p className="font-bold text-sm text-gray-900 leading-tight">
                    {selectedMatch.home_team} vs {selectedMatch.away_team}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatDate(selectedMatch.match_date).date} · {formatDate(selectedMatch.match_date).time}
                  </p>
                </div>
                <span className="text-xl">{getFlag(selectedMatch.away_team)}</span>
                <button
                  onClick={() => { setSelectedMatch(null); setSelectedBar(null) }}
                  className="text-gray-300 hover:text-gray-500 text-lg leading-none ml-1"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── LEFT SIDEBAR ── */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-[60px] bg-white shadow-md flex flex-col items-center pt-3 pb-4 gap-1">
          <Link
            href="/login"
            title="Iniciar sesión como Bar"
            className="group flex flex-col items-center gap-0.5 w-11 py-2.5 rounded-xl hover:bg-green-50 transition-colors"
          >
            <span className="text-2xl">🏪</span>
            <span className="text-[9px] font-medium text-gray-400 group-hover:text-green-700 leading-tight text-center">Bar</span>
          </Link>

          <Link
            href="/login?type=fan"
            title="Iniciar sesión como Espectador"
            className="group flex flex-col items-center gap-0.5 w-11 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">👤</span>
            <span className="text-[9px] font-medium text-gray-400 group-hover:text-blue-600 leading-tight text-center">Fan</span>
          </Link>

          <div className="flex-1" />

          <Link
            href="/"
            title="Ajustes"
            className="group flex flex-col items-center gap-0.5 w-11 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[9px] font-medium text-gray-400 group-hover:text-gray-700">Ajustes</span>
          </Link>
        </div>

        {/* ── BAR INFO CARD ── */}
        {selectedBar && (
          <div
            className="absolute bottom-4 z-20 bg-white rounded-2xl shadow-xl overflow-hidden transition-all"
            style={{ left: '72px', width: '300px', maxWidth: 'calc(100vw - 88px)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{selectedBar.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{selectedBar.address}</p>
              </div>
              <button
                onClick={() => setSelectedBar(null)}
                className="text-gray-300 hover:text-gray-500 text-xl leading-none ml-2 shrink-0"
              >
                ×
              </button>
            </div>

            <div className="p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {selectedBar.phone}
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">{selectedBar.description}</p>

              {selectedBar.offer && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                  {selectedBar.offer}
                </div>
              )}

              <button className="w-full py-2 bg-green-700 text-white text-xs font-bold rounded-xl hover:bg-green-800 transition-colors">
                Cómo llegar →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
