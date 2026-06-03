'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
          <Link href="/" className="flex items-center gap-3 text-3xl font-bold mb-3">
            <span>⚽</span> MundiApp
          </Link>
          <p className="text-green-200/80 text-sm leading-relaxed mb-10">
            Gestiona tu bar y llega a miles de aficionados del Mundial 2026
          </p>
          <div className="grid grid-cols-2 gap-3 w-full">
            {['🏟️ Partidos en vivo', '📍 Mapa de bares', '🍺 Ofertas especiales', '📱 100% móvil'].map((f) => (
              <div
                key={f}
                className="bg-green-800/50 border border-green-700/30 rounded-xl px-3 py-2.5 text-xs text-green-200 text-center backdrop-blur-sm"
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors group"
          >
            <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">←</span>
            Volver
          </button>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 text-green-700 font-bold text-xl mb-8">
            <span>⚽</span> MundiApp
          </Link>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h2>
          <p className="text-gray-500 text-sm mb-8">Accede al panel de tu bar</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bar@ejemplo.com"
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-green-700 font-semibold hover:underline">
              Registra tu bar
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
