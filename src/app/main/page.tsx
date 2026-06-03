import Link from 'next/link'

export default function MainPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-green-700 font-bold text-xl">MundiApp</Link>
        <span className="text-sm text-gray-400">Mundial 2026</span>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Partidos y bares</h2>

        {/* Placeholder mapa */}
        <div className="w-full h-72 bg-green-100 rounded-2xl flex items-center justify-center mb-8 border border-green-200">
          <p className="text-green-700 font-medium">🗺️ Mapa de bares (próximamente)</p>
        </div>

        {/* Placeholder lista partidos */}
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">Equipo A vs Equipo B</p>
                <p className="text-sm text-gray-400">Fase de grupos · 15 Jun 2026</p>
              </div>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                3 bares
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
