'use client'

import { useState, useEffect } from 'react'

const AGE_RANGES = [
  { label: 'Menos de 18', value: '<18' },
  { label: '18 – 24', value: '18-24' },
  { label: '25 – 34', value: '25-34' },
  { label: '35 – 44', value: '35-44' },
  { label: '45 – 54', value: '45-54' },
  { label: '55 o más', value: '55+' },
]

const TEAMS = [
  { name: 'España', flag: '🇪🇸' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Brasil', flag: '🇧🇷' },
  { name: 'Francia', flag: '🇫🇷' },
  { name: 'Alemania', flag: '🇩🇪' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Italia', flag: '🇮🇹' },
  { name: 'Países Bajos', flag: '🇳🇱' },
  { name: 'Bélgica', flag: '🇧🇪' },
  { name: 'México', flag: '🇲🇽' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Marruecos', flag: '🇲🇦' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Canadá', flag: '🇨🇦' },
  { name: 'Japón', flag: '🇯🇵' },
  { name: 'Croacia', flag: '🇭🇷' },
  { name: 'Senegal', flag: '🇸🇳' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Perú', flag: '🇵🇪' },
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Polonia', flag: '🇵🇱' },
  { name: 'Suiza', flag: '🇨🇭' },
  { name: 'Turquía', flag: '🇹🇷' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Corea del Sur', flag: '🇰🇷' },
]

export default function Onboarding() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)

  const [age, setAge] = useState('')
  const [team, setTeam] = useState('')
  const [teamSearch, setTeamSearch] = useState('')
  const [locationStatus, setLocationStatus] = useState<'idle' | 'granted' | 'denied'>('idle')

  useEffect(() => {
    const done = localStorage.getItem('mundi_onboarded')
    if (!done) setShow(true)
  }, [])

  function goNext() {
    setFading(true)
    setTimeout(() => {
      setStep((s) => s + 1)
      setFading(false)
    }, 180)
  }

  function skip() {
    finish()
  }

  function finish() {
    localStorage.setItem('mundi_onboarded', 'true')
    if (age) localStorage.setItem('mundi_age', age)
    if (team) localStorage.setItem('mundi_fav_team', team)
    setFading(true)
    setTimeout(() => setShow(false), 200)
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      finish()
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        localStorage.setItem('mundi_lat', String(pos.coords.latitude))
        localStorage.setItem('mundi_lng', String(pos.coords.longitude))
        setLocationStatus('granted')
        setTimeout(finish, 900)
      },
      () => {
        setLocationStatus('denied')
        setTimeout(finish, 700)
      },
    )
  }

  if (!show) return null

  const filteredTeams = TEAMS.filter((t) =>
    t.name.toLowerCase().includes(teamSearch.toLowerCase()),
  )

  const canNext = [
    age !== '',
    team !== '',
    true,
  ][step]

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex flex-col transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
        <span className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <span>⚽</span> MundiApp
        </span>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-6 h-2 bg-green-700'
                  : i < step
                  ? 'w-2 h-2 bg-green-400'
                  : 'w-2 h-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={skip}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Saltar
        </button>
      </div>

      {/* Step content */}
      <div
        className={`flex-1 overflow-y-auto px-6 py-6 transition-all duration-180 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        {/* Step 0 — Age */}
        {step === 0 && (
          <div className="max-w-sm mx-auto">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Paso 1 de 3</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">¿Cuántos años tienes?</h2>
            <p className="text-gray-500 text-sm mb-8">Ayúdanos a personalizar tu experiencia</p>

            <div className="grid grid-cols-2 gap-3">
              {AGE_RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setAge(r.value)}
                  className={[
                    'py-4 rounded-2xl border-2 font-semibold text-sm transition-all',
                    age === r.value
                      ? 'border-green-700 bg-green-700 text-white shadow-md scale-[1.02]'
                      : 'border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50',
                  ].join(' ')}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Favorite team */}
        {step === 1 && (
          <div className="max-w-sm mx-auto">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Paso 2 de 3</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">¿Cuál es tu selección?</h2>
            <p className="text-gray-500 text-sm mb-5">Aparecerá siempre al principio de la lista</p>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar selección..."
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />

            <div className="grid grid-cols-2 gap-2.5">
              {filteredTeams.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTeam(t.name)}
                  className={[
                    'flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all text-left',
                    team === t.name
                      ? 'border-green-700 bg-green-700 text-white shadow-md scale-[1.02]'
                      : 'border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50',
                  ].join(' ')}
                >
                  <span className="text-2xl shrink-0">{t.flag}</span>
                  <span className="truncate">{t.name}</span>
                </button>
              ))}

              {filteredTeams.length === 0 && (
                <p className="col-span-2 text-center text-sm text-gray-400 py-8">
                  No se encontró esa selección
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2 — Location */}
        {step === 2 && (
          <div className="max-w-sm mx-auto flex flex-col items-center text-center pt-6">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Paso 3 de 3</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Dónde estás?</h2>
            <p className="text-gray-500 text-sm mb-10 max-w-xs">
              Usaremos tu ubicación para mostrarte los bares más cercanos a ti
            </p>

            {locationStatus === 'idle' && (
              <>
                <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-8 text-6xl">
                  📍
                </div>
                <button
                  onClick={requestLocation}
                  className="w-full max-w-xs py-4 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-all shadow-md hover:shadow-lg mb-4"
                >
                  Permitir ubicación
                </button>
                <button
                  onClick={finish}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Ahora no
                </button>
              </>
            )}

            {locationStatus === 'granted' && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center text-6xl">
                  ✅
                </div>
                <p className="font-semibold text-green-700">¡Ubicación activada!</p>
                <p className="text-sm text-gray-500">Cargando los bares más cercanos...</p>
              </div>
            )}

            {locationStatus === 'denied' && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center text-6xl">
                  🗺️
                </div>
                <p className="text-sm text-gray-500">Sin problema, podrás buscar bares manualmente</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="shrink-0 px-6 pb-8 pt-4 border-t border-gray-100 max-w-sm mx-auto w-full">
        {step < 2 ? (
          <button
            onClick={canNext ? goNext : undefined}
            disabled={!canNext}
            className={[
              'w-full py-4 rounded-2xl font-bold text-base transition-all',
              canNext
                ? 'bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            Siguiente →
          </button>
        ) : locationStatus === 'idle' ? null : (
          <button
            onClick={finish}
            className="w-full py-4 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-all shadow-md"
          >
            Empezar →
          </button>
        )}
      </div>
    </div>
  )
}
