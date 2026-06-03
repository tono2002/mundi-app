'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapBar {
  id: string
  name: string
  description: string | null
  address: string | null
  phone: string | null
  lat: number
  lng: number
}

interface Props {
  bars: MapBar[]
  selectedBarId?: string | null
  onBarSelect: (bar: MapBar) => void
}

function createMarkerIcon(selected: boolean) {
  const color = selected ? '#14532d' : '#15803d'
  const ring = selected ? 'box-shadow:0 0 0 3px white,0 0 0 5px ' + color : ''
  return L.divIcon({
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    html: `<div style="
      width:36px;height:36px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      ${ring}
    ">
      <span style="transform:rotate(45deg);font-size:16px;line-height:1">🍺</span>
    </div>`,
  })
}

function GeolocateUser() {
  const map = useMap()
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        map.flyTo([coords.latitude, coords.longitude], 14, { animate: true, duration: 1.5 })
      },
      () => {
        // fallback: Madrid
        map.flyTo([40.4168, -3.7038], 13, { animate: true, duration: 1.5 })
      },
      { timeout: 5000 }
    )
  }, [map])
  return null
}

export default function MapComponent({ bars, selectedBarId, onBarSelect }: Props) {
  return (
    <MapContainer
      center={[40.4168, -3.7038]}
      zoom={13}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      <GeolocateUser />

      {bars.map((bar) => (
        <Marker
          key={bar.id}
          position={[bar.lat, bar.lng]}
          icon={createMarkerIcon(bar.id === selectedBarId)}
          eventHandlers={{ click: () => onBarSelect(bar) }}
        />
      ))}
    </MapContainer>
  )
}
