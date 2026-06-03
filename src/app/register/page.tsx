'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AddressAutocomplete from '@/components/ui/AddressAutocomplete'

type Step = 1 | 2

interface AccountData {
  barName: string
  email: string
  password: string
}

interface ProfileData {
  description: string
  address: string
  lat: number | null
  lng: number | null
  phone: string
  website: string
}

function StepIndicator({ current }: { current: Step }) {
  const labels: Record<Step, string> = { 1: 'Crear cuenta', 2: 'Perfil del bar' }
  return (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2] as Step[]).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step <= current ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            {step}
          </div>
          {step < 2 && (
            <div className={`w-12 h-0.5 ${step < current ? 'bg-green-700' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-500">{labels[current]}</span>
    </div>
  )
}

const leftPanelItems = [
  '✓ Perfil de tu bar en el mapa',
  '✓ Selección de partidos a emitir',
  '✓ Ofertas especiales para fans',
  '✓ Visibilidad ante miles de aficionados',
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [barId, setBarId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [account, setAccount] = useState<AccountData>({ barName: '', email: '', password: '' })
  const [profile, setProfile] = useState<ProfileData>({
    description: '',
    address: '',
    lat: null,
    lng: null,
    phone: '',
    website: '',
  })

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (!data.user) {
      setError('No se pudo crear la cuenta. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    const { data: barData, error: barError } = await supabase
      .from('bars')
      .insert({ owner_id: data.user.id, name: account.barName, photos: [] })
      .select('id')
      .single()

    if (barError) {
      setError(barError.message)
      setLoading(false)
      return
    }

    setBarId(barData.id)
    setLoading(false)
    setStep(2)
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('bars')
      .update({
        description: profile.description || null,
        address: profile.address || null,
        lat: profile.lat,
        lng: profile.lng,
        phone: profile.phone || null,
        website: profile.website || null,
      })
      .eq('id', barId)

    if (updateError) {
      setError(updateError.message)
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
            Únete a los bares que ya forman parte del Mundial 2026
          </p>
          <div className="bg-green-800/40 border border-green-700/30 rounded-2xl p-6 w-full text-left backdrop-blur-sm">
            <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-4">
              Incluye gratis
            </p>
            {leftPanelItems.map((item) => (
              <p key={item} className="text-green-100 text-sm mb-2">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <button
            type="button"
            onClick={() => (step === 2 ? setStep(1) : router.back())}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors group"
          >
            <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">←</span>
            {step === 2 ? 'Atrás' : 'Volver'}
          </button>

          <Link href="/" className="lg:hidden flex items-center gap-2 text-green-700 font-bold text-xl mb-8">
            <span>⚽</span> MundiApp
          </Link>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Registra tu bar</h2>
          <p className="text-gray-500 text-sm mb-6">Llega a miles de aficionados del Mundial</p>

          <StepIndicator current={step} />

          {step === 1 && (
            <form onSubmit={handleStep1} className="flex flex-col gap-4">
              <Input
                label="Nombre del bar"
                type="text"
                required
                value={account.barName}
                onChange={(e) => setAccount({ ...account, barName: e.target.value })}
                placeholder="Bar El Gol"
                autoComplete="organization"
              />
              <Input
                label="Email"
                type="email"
                required
                value={account.email}
                onChange={(e) => setAccount({ ...account, email: e.target.value })}
                placeholder="bar@ejemplo.com"
                autoComplete="email"
              />
              <Input
                label="Contraseña"
                type="password"
                required
                minLength={6}
                value={account.password}
                onChange={(e) => setAccount({ ...account, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
                Continuar →
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  rows={3}
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-150 resize-none"
                  placeholder="Terraza, pantallas 4K, ambiente familiar..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dirección <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <AddressAutocomplete
                  value={profile.address}
                  onChange={(address, lat, lng) => setProfile({ ...profile, address, lat, lng })}
                  placeholder="Calle Gran Vía 1, Madrid"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {profile.lat ? '✓ Ubicación guardada — aparecerás en el mapa' : 'Selecciona una sugerencia para fijar tu ubicación en el mapa'}
                </p>
              </div>
              <Input
                label="Teléfono"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+34 600 000 000"
              />
              <Input
                label="Web / Instagram"
                type="text"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://instagram.com/mibar"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
                Finalizar registro
              </Button>
            </form>
          )}

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
