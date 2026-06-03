import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-green-700">MundiApp</h1>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm px-4 py-2 border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Registrar mi bar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-white to-green-50">
        <span className="text-6xl mb-6">⚽</span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Vive el Mundial 2026<br />en el mejor bar
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mb-10">
          Descubre los bares de España donde podrás ver cada partido del Mundial.
          Sin registro, sin complicaciones.
        </p>
        <Link
          href="/main"
          className="px-8 py-4 bg-green-700 text-white text-lg font-semibold rounded-xl hover:bg-green-800 transition-colors shadow-md"
        >
          Ver partidos y bares →
        </Link>
      </section>

      {/* Sección bares */}
      <section className="bg-white border-t border-gray-100 px-6 py-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          ¿Tienes un bar?
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Regístrate y añade tu bar para que los aficionados te encuentren fácilmente.
          Sube fotos, describe tu ambiente y especifica qué partidos vas a poner.
        </p>
        <Link
          href="/register"
          className="inline-block px-6 py-3 border-2 border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
        >
          Registrar mi bar gratis
        </Link>
      </section>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        MundiApp © 2026
      </footer>
    </main>
  )
}
