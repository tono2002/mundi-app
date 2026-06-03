'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-green-700 transition-colors"
          >
            <span>⚽</span>
            <span>MundiApp</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              href="/main"
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ver partidos
            </Link>
            <Link
              href="/login"
              className="text-sm px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors font-semibold"
            >
              Registrar mi bar
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 mb-1.5 transition-all origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 mb-1.5 transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden py-3 border-t border-gray-100 flex flex-col gap-1">
            <Link href="/main" onClick={() => setOpen(false)} className="text-sm text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-100">
              Ver partidos
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="text-sm text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-100">
              Iniciar sesión
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="text-sm font-semibold text-green-700 px-3 py-2.5 rounded-lg hover:bg-green-50">
              Registrar mi bar
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
