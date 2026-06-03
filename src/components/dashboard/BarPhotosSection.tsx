'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import Badge from '@/components/ui/Badge'

interface Props {
  barId: string
  initialPhotos: string[]
}

const MAX_PHOTOS = 6
const MAX_SIZE_MB = 5

export default function BarPhotosSection({ barId, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) return

    setError('')
    setUploading(true)

    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`"${file.name}" supera los ${MAX_SIZE_MB}MB`)
        continue
      }
      if (!file.type.startsWith('image/')) continue

      const ext = file.name.split('.').pop()
      const path = `${barId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('bar-photos')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        setError('Error al subir la foto. Comprueba que el bucket "bar-photos" existe en Supabase Storage.')
        continue
      }

      const { data: { publicUrl } } = supabase.storage.from('bar-photos').getPublicUrl(path)
      newUrls.push(publicUrl)
    }

    if (newUrls.length > 0) {
      const updated = [...photos, ...newUrls]
      await supabase.from('bars').update({ photos: updated }).eq('id', barId)
      setPhotos(updated)
    }

    setUploading(false)
  }

  async function removePhoto(url: string) {
    const supabase = createClient()
    const updated = photos.filter((p) => p !== url)
    await supabase.from('bars').update({ photos: updated }).eq('id', barId)
    setPhotos(updated)

    // delete from storage
    const path = url.split('/bar-photos/')[1]
    if (path) await supabase.storage.from('bar-photos').remove([path])
  }

  const slots = Array.from({ length: MAX_PHOTOS })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sm:col-span-2">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>📸</span> Fotos del local
        </h2>
        <Badge variant={photos.length > 0 ? 'green' : 'gray'}>{photos.length} / {MAX_PHOTOS} fotos</Badge>
      </div>

      <div className="p-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {slots.map((_, i) => {
            const url = photos[i]
            if (url) {
              return (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(url)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              )
            }
            return (
              <button
                key={i}
                onClick={() => photos.length < MAX_PHOTOS && inputRef.current?.click()}
                disabled={uploading || photos.length >= MAX_PHOTOS}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-green-400 hover:text-green-400 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed gap-1"
              >
                {uploading && i === photos.length ? (
                  <svg className="animate-spin h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="text-xl">+</span>
                )}
              </button>
            )
          })}
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        <p className="text-xs text-gray-400 mt-3">PNG, JPG o WebP · máx. {MAX_SIZE_MB}MB por foto</p>
      </div>
    </div>
  )
}
