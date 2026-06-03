import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import BarMatchesSection from '@/components/dashboard/BarMatchesSection'
import BarPhotosSection from '@/components/dashboard/BarPhotosSection'
import { Globe, Calendar, Trophy, Eye, Star, Building2, Camera } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: bar }, { data: allMatches }, { data: barMatches }] = await Promise.all([
    supabase.from('bars').select('*').eq('owner_id', user.id).single(),
    supabase.from('matches').select('*').order('match_date', { ascending: true }),
    supabase.from('bars').select('id').eq('owner_id', user.id).single().then(async ({ data: b }) => {
      if (!b) return { data: [] }
      return supabase.from('bar_matches').select('match_id').eq('bar_id', b.id)
    }),
  ])

  const selectedMatchIds = (barMatches ?? []).map((bm: { match_id: string }) => bm.match_id)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-green-700 transition-colors">
            <Globe className="w-6 h-6 text-green-700" />
            <span>MundiApp</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-500">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Panel de {bar?.name ?? 'tu bar'}</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona tu perfil y los partidos que vas a emitir</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Partidos', value: selectedMatchIds.length.toString(), icon: <Calendar className="w-5 h-5 text-green-600" /> },
            { label: 'Fases', value: '—', icon: <Trophy className="w-5 h-5 text-amber-500" /> },
            { label: 'Visitas', value: '—', icon: <Eye className="w-5 h-5 text-blue-500" /> },
            { label: 'Valoración', value: '—', icon: <Star className="w-5 h-5 text-yellow-500" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-1 shadow-sm">
              {stat.icon}
              <span className="text-xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Perfil del bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" /> Perfil del bar
              </h2>
              <Badge variant={bar?.description && bar?.address ? 'green' : 'amber'}>
                {bar?.description && bar?.address ? 'Completo' : 'Pendiente'}
              </Badge>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Nombre</p>
                <p className="text-sm font-medium text-gray-800">{bar?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Dirección</p>
                <p className="text-sm text-gray-600">{bar?.address ?? 'Sin dirección'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Descripción</p>
                <p className="text-sm text-gray-600">{bar?.description ?? 'Sin descripción'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Teléfono</p>
                <p className="text-sm text-gray-600">{bar?.phone ?? '—'}</p>
              </div>
              <button className="mt-2 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors">
                + Editar perfil
              </button>
            </div>
          </div>

          {bar && (
            <BarMatchesSection
              barId={bar.id}
              allMatches={allMatches ?? []}
              initialSelectedIds={selectedMatchIds}
            />
          )}

          {bar && (
            <BarPhotosSection
              barId={bar.id}
              initialPhotos={bar.photos ?? []}
            />
          )}
        </div>
      </main>
    </div>
  )
}
