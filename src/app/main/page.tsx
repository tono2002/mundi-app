'use client'

import { useState } from 'react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'

const ROUNDS = ['Todos', 'Fase de grupos', 'Octavos', 'Cuartos', 'Semifinal', 'Final']

const MATCHES = [
  { id: 1, home: 'España', away: 'Marruecos', flagHome: '🇪🇸', flagAway: '🇲🇦', date: '12 Jun', time: '21:00', round: 'Fase de grupos', group: 'A', bars: 5 },
  { id: 2, home: 'Argentina', away: 'Brasil', flagHome: '🇦🇷', flagAway: '🇧🇷', date: '14 Jun', time: '18:00', round: 'Fase de grupos', group: 'B', bars: 8 },
  { id: 3, home: 'Francia', away: 'Alemania', flagHome: '🇫🇷', flagAway: '🇩🇪', date: '15 Jun', time: '21:00', round: 'Fase de grupos', group: 'C', bars: 3 },
  { id: 4, home: 'Portugal', away: 'Italia', flagHome: '🇵🇹', flagAway: '🇮🇹', date: '17 Jun', time: '19:00', round: 'Fase de grupos', group: 'D', bars: 6 },
  { id: 5, home: 'Inglaterra', away: 'Japón', flagHome: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagAway: '🇯🇵', date: '18 Jun', time: '15:00', round: 'Fase de grupos', group: 'E', bars: 2 },
]

const DEMO_BAR = {
  name: 'Bar El Gol',
  address: 'Calle Fuencarral, 43, Madrid',
  phone: '+34 91 123 45 67',
  description: 'El bar más futbolero del barrio. Ambiente inmejorable, pantallas gigantes y cerveza fría.',
  offer: '🍺 2x1 en cervezas durante los partidos de España',
  matches: ['España vs Marruecos', 'Argentina vs Brasil'],
}

export default function MainPage() {
  const [activeRound, setActiveRound] = useState('Todos')
  const [selectedBar, setSelectedBar] = useState<typeof DEMO_BAR | null>(null)

  const filtered = activeRound === 'Todos'
    ? MATCHES
    : MATCHES.filter((m) => m.round === activeRound)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-green-700 transition-colors">
            <span>⚽</span>
            <span>MundiApp</span>
          </Link>
          <span className="text-sm text-gray-400 hidden sm:block">Mundial 2026</span>
          <Link href="/login" className="text-sm font-medium text-green-700 hover:underline">
            Panel de bar →
          </Link>
        </div>
      </header>

      {/* Filter pills */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {ROUNDS.map((round) => (
              <button
                key={round}
                onClick={() => setActiveRound(round)}
                className={[
                  'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                  activeRound === round
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ].join(' ')}
              >
                {round}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex gap-6 lg:flex-row flex-col">

          {/* Match list — left column */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {activeRound === 'Todos' ? 'Todos los partidos' : activeRound}
              <span className="text-sm font-normal text-gray-400 ml-2">{filtered.length} partidos</span>
            </h2>

            <div className="flex flex-col gap-3">
              {filtered.map((match) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedBar(DEMO_BAR)}
                  className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Teams */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{match.flagHome}</span>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                          {match.home}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">vs</span>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                          {match.away}
                        </span>
                        <span className="text-2xl">{match.flagAway}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="gray">{match.round} · Grupo {match.group}</Badge>
                        <span className="text-xs text-gray-400">{match.date} · {match.time}</span>
                      </div>
                    </div>

                    {/* Bar count */}
                    <div className="shrink-0 text-right">
                      <Badge variant="green" className="text-sm px-3 py-1">
                        {match.bars} bares
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map + sidebar — right column on desktop */}
          <div className="lg:w-[420px] shrink-0">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Mapa de bares</h2>

            {/* Map placeholder */}
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-green-50"
              style={{ height: selectedBar ? '260px' : '420px' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-green-700">
                <span className="text-5xl mb-3">🗺️</span>
                <p className="text-sm font-medium">Mapa interactivo</p>
                <p className="text-xs text-green-600/70 mt-1">Haz clic en un partido para ver los bares</p>
              </div>
              {/* Fake marker */}
              <button
                onClick={() => setSelectedBar(DEMO_BAR)}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg hover:bg-green-800 transition-colors flex items-center gap-1"
              >
                📍 Bar El Gol
              </button>
            </div>

            {/* Bar side panel */}
            {selectedBar && (
              <div className="mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">{selectedBar.name}</h3>
                  <button
                    onClick={() => setSelectedBar(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none transition-colors"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">📍</span>
                    {selectedBar.address}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>📞</span>
                    {selectedBar.phone}
                  </p>
                  <p className="text-sm text-gray-600">{selectedBar.description}</p>

                  {selectedBar.offer && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                      {selectedBar.offer}
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Partidos que emite</p>
                    <div className="flex flex-col gap-1">
                      {selectedBar.matches.map((m) => (
                        <div key={m} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-1 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
                    Cómo llegar →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: floating selected bar card */}
      {selectedBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-5 z-50 max-h-[60vh] overflow-y-auto">
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg">{selectedBar.name}</h3>
            <button onClick={() => setSelectedBar(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>
          <p className="text-sm text-gray-600 mb-1">📍 {selectedBar.address}</p>
          <p className="text-sm text-gray-600 mb-3">📞 {selectedBar.phone}</p>
          {selectedBar.offer && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800 mb-3">
              {selectedBar.offer}
            </div>
          )}
          <button className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors">
            Cómo llegar →
          </button>
        </div>
      )}
    </div>
  )
}
