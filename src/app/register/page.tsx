'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [barName, setBarName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { bar_name: barName } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('bars').insert({
        owner_id: data.user.id,
        name: barName,
        photos: [],
      })
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
            Únete a los bares que ya forman parte del Mundial 2026
          </p>
          <div className="bg-green-800/40 border border-green-700/30 rounded-2xl p-6 w-full text-left backdrop-blur-sm">
            <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-4">Incluye gratis</p>
            {[
              '✓ Perfil de tu bar en el mapa',
              '✓ Selección de partidos a emitir',
              '✓ Ofertas especiales para fans',
              '✓ Visibilidad ante miles de aficionados',
            ].map((item) => (
              <p key={item} className="text-green-100 text-sm mb-2">{item}</p>
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

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Registra tu bar</h2>
          <p className="text-gray-500 text-sm mb-8">Llega a miles de aficionados del Mundial</p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              label="Nombre del bar"
              type="text"
              required
              value={barName}
              onChange={(e) => setBarName(e.target.value)}
              placeholder="Bar El Gol"
              autoComplete="organization"
            />
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              {loading ? 'Registrando...' : 'Crear cuenta gratis'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-green-700 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
