import Link from 'next/link'
import Navbar from '@/components/Navbar'

const features = [
  {
    icon: '🗓️',
    title: 'Todos los partidos',
    desc: 'Consulta el calendario completo del Mundial 2026 y filtra por grupo o fase de eliminatoria.',
  },
  {
    icon: '📍',
    title: 'Bares cerca de ti',
    desc: 'Encuentra en el mapa los bares que emiten cada partido en tu zona.',
  },
  {
    icon: '🍺',
    title: 'Ambiente garantizado',
    desc: 'Consulta las ofertas especiales de cada bar y elige el mejor plan para cada partido.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 sm:py-36 overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-3xl w-full mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-800/60 border border-green-600/40 text-green-300 text-xs sm:text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span>🏆</span>
            <span>Mundial 2026 · USA, Canadá & México · 104 partidos</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Vive el Mundial<br />
            <span className="text-green-400">en el mejor bar</span>
          </h1>

          <p className="text-base sm:text-xl text-green-100/75 max-w-xl mx-auto mb-10 leading-relaxed">
            Descubre los bares de España donde ver cada partido del Mundial 2026.
            Sin registro, sin complicaciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/main"
              className="px-8 py-4 bg-white text-green-900 text-base font-bold rounded-2xl hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Ver partidos y bares →
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 border-2 border-green-400/40 text-white text-base font-semibold rounded-2xl hover:bg-white/10 hover:border-green-400/70 transition-all"
            >
              Registrar mi bar
            </Link>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="grid sm:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <span className="text-5xl block mb-5">{f.icon}</span>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="border-t border-gray-100" />
      </div>

      {/* Bar owner CTA */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto bg-green-950 rounded-3xl px-8 sm:px-16 py-14 text-center">
          <span className="text-5xl block mb-5">🍺</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">¿Tienes un bar?</h2>
          <p className="text-green-200/80 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Regístrate gratis y llega a miles de aficionados. Añade tus partidos,
            fotos del local y ofertas especiales para el Mundial.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 bg-white text-green-900 font-bold rounded-2xl hover:bg-green-50 transition-all shadow-md"
          >
            Registrar mi bar gratis
          </Link>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100 mt-auto">
        MundiApp © 2026 · Hecho para los aficionados del fútbol
      </footer>
    </div>
  )
}
