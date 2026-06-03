import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: bar } = await supabase
    .from('bars')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-green-700 font-bold text-xl">MundiApp</Link>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Panel de {bar?.name ?? 'tu bar'}
        </h2>
        <p className="text-gray-500 text-sm mb-8">Gestiona tu perfil y los partidos que vas a emitir</p>

        {/* Secciones pendientes de implementar */}
        <div className="grid gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-700 mb-1">📋 Perfil del bar</h3>
            <p className="text-sm text-gray-400">Descripción, dirección, teléfono y fotos</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-700 mb-1">⚽ Partidos que emites</h3>
            <p className="text-sm text-gray-400">Selecciona qué partidos pondrás y añade comentarios u ofertas especiales</p>
          </div>
        </div>
      </div>
    </main>
  )
}
