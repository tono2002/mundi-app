'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { getFlag } from '@/lib/flags'
import type { Match } from '@/types'
import Badge from '@/components/ui/Badge'

interface Props {
  barId: string
  allMatches: Match[]
  initialSelectedIds: string[]
}

const ROUND_ORDER = [
  'Fase de grupos',
  'Dieciseisavos',
  'Octavos',
  'Cuartos',
  'Semifinales',
  'Tercer puesto',
  'Final',
]

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

function MatchRow({ match, selected, onToggle }: { match: Match; selected: boolean; onToggle: () => void }) {
  const { date, time } = formatDate(match.match_date)
  const home = isPlaceholder(match.home_team) ? 'Por determinar' : match.home_team
  const away = isPlaceholder(match.away_team) ? 'Por determinar' : match.away_team
  return (
    <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-xl transition-colors">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="w-4 h-4 rounded accent-green-700 cursor-pointer shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {getFlag(match.home_team)} {home} <span className="text-gray-400 font-normal">vs</span> {getFlag(match.away_team)} {away}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{date} · {time}</p>
      </div>
    </label>
  )
}

export default function BarMatchesSection({ barId, allMatches, initialSelectedIds }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds))
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const selectedMatches = useMemo(
    () => allMatches.filter((m) => selectedIds.has(m.id)),
    [allMatches, selectedIds]
  )

  const grouped = useMemo(() => {
    const filtered = allMatches.filter((m) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        m.home_team.toLowerCase().includes(q) ||
        m.away_team.toLowerCase().includes(q) ||
        (m.group_stage ?? '').toLowerCase().includes(q)
      )
    })

    const map = new Map<string, Map<string, Match[]>>()
    for (const round of ROUND_ORDER) {
      map.set(round, new Map())
    }
    for (const m of filtered) {
      const round = m.round
      if (!map.has(round)) map.set(round, new Map())
      const subKey = m.group_stage ?? round
      const roundMap = map.get(round)!
      if (!roundMap.has(subKey)) roundMap.set(subKey, [])
      roundMap.get(subKey)!.push(m)
    }
    return map
  }, [allMatches, search])

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setSaving(false)
      alert('Tu sesión ha expirado. Por favor recarga la página e inicia sesión de nuevo.')
      return
    }

    const toAdd = [...selectedIds].filter((id) => !initialSelectedIds.includes(id))
    const toRemove = initialSelectedIds.filter((id) => !selectedIds.has(id))

    if (toAdd.length > 0) {
      const { error } = await supabase.from('bar_matches').insert(
        toAdd.map((match_id) => ({ bar_id: barId, match_id }))
      )
      if (error) {
        console.error('Error insertando bar_matches:', error)
        setSaving(false)
        alert(`Error al guardar partidos: ${error.message}`)
        return
      }
    }
    if (toRemove.length > 0) {
      const { error } = await supabase.from('bar_matches').delete().eq('bar_id', barId).in('match_id', toRemove)
      if (error) {
        console.error('Error eliminando bar_matches:', error)
        setSaving(false)
        alert(`Error al eliminar partidos: ${error.message}`)
        return
      }
    }

    setSaving(false)
    setShowModal(false)
    window.location.reload()
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>⚽</span> Partidos que emites
          </h2>
          <Badge variant={selectedMatches.length > 0 ? 'green' : 'gray'}>
            {selectedMatches.length} activos
          </Badge>
        </div>

        <div className="p-6 flex flex-col gap-3">
          {selectedMatches.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Todavía no has añadido partidos.<br />
              Selecciona los que pondrás en tu bar.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedMatches.map((m) => {
                const { date, time } = formatDate(m.match_date)
                const home = isPlaceholder(m.home_team) ? 'Por determinar' : m.home_team
                const away = isPlaceholder(m.away_team) ? 'Por determinar' : m.away_team
                return (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-green-600 font-bold text-lg">⚽</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getFlag(m.home_team)} {home} vs {getFlag(m.away_team)} {away}
                      </p>
                      <p className="text-xs text-gray-500">{date} · {time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors"
          >
            + Añadir / editar partidos
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-bold text-gray-900">Selecciona los partidos</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedIds.size} seleccionados</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100 shrink-0">
              <input
                type="text"
                placeholder="Buscar equipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>

            {/* Match list */}
            <div className="overflow-y-auto flex-1 px-2 py-2">
              {[...grouped.entries()].map(([round, subgroups]) => {
                const hasMatches = [...subgroups.values()].some((ms) => ms.length > 0)
                if (!hasMatches) return null
                return (
                  <div key={round} className="mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2">{round}</p>
                    {[...subgroups.entries()].map(([subKey, matches]) => {
                      if (matches.length === 0) return null
                      return (
                        <div key={subKey}>
                          {round === 'Fase de grupos' && (
                            <p className="text-[11px] text-gray-400 px-4 py-1 font-medium">{subKey}</p>
                          )}
                          {matches.map((m) => (
                            <MatchRow
                              key={m.id}
                              match={m}
                              selected={selectedIds.has(m.id)}
                              onToggle={() => toggle(m.id)}
                            />
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-colors disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
