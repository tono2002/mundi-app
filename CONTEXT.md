# MundiApp — Contexto del proyecto

## Qué es
App para aficionados del Mundial 2026. Los fans encuentran bares que retransmiten partidos en el mapa. Los bares se registran, eligen qué partidos emiten y gestionan su perfil.

## Stack
- **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind v4**
- **Supabase** (PostgreSQL + Auth + Storage)
- **Leaflet / react-leaflet v5** — mapa real con tiles CartoDB Voyager
- **lucide-react** — iconos
- **Nominatim** (OpenStreetMap) — geocodificación gratuita

## Colaboradores
- **Tono** → funcionalidad (este repo)
- **Marti** → diseño / UI

## Cómo arrancar
```bash
npm install
npm run dev   # http://localhost:3000
```
`.env.local` necesario (no está en git):
```
NEXT_PUBLIC_SUPABASE_URL=https://gspsqujbopxewaojnfiy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key from Supabase dashboard>
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=<secret key from Supabase dashboard>
SYNC_SECRET=mundi2026
```

---

## Base de datos (Supabase)

### Tablas
| Tabla | Descripción |
|-------|-------------|
| `bars` | Bares registrados. Campos: `id, owner_id, name, description, address, lat, lng, phone, website, photos[]` |
| `matches` | 104 partidos del Mundial 2026. Campos: `id, external_id, home_team, away_team, match_date (UTC), round, group_stage` |
| `bar_matches` | Qué partidos emite cada bar. Campos: `id, bar_id, match_id, comments, special_offer` |

### RLS
- `bars`: lectura pública; CRUD solo al dueño (`owner_id = auth.uid()`)
- `matches`: solo lectura pública
- `bar_matches`: lectura pública; INSERT/UPDATE/DELETE solo al dueño del bar vinculado

### Migrations aplicadas
- `001_add_match_external_id.sql` — añade `external_id text unique` a `matches`
- `002_fix_bar_matches_rls.sql` — separa la política `for all` en políticas individuales con `with check` explícito

### Storage
- Bucket `bar-photos` (público) — para fotos de los bares. Hay que crearlo manualmente en Supabase Dashboard → Storage.

---

## Páginas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Server | Landing page — bienvenida a fans y bares |
| `/register` | Client | Registro de bar en 2 pasos: cuenta + perfil con autocomplete de dirección |
| `/login` | Client | Login de bar |
| `/dashboard` | Server + Client | Panel del bar: perfil, selección de partidos, fotos |
| `/main` | Server + Client | Vista de fans: mapa Leaflet + carrusel de partidos |

---

## APIs

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/signout` | POST | Cierra sesión y redirige a `/` |
| `/api/sync-matches` | GET | Descarga partidos de openfootball y hace upsert en `matches`. Requiere `?secret=mundi2026`. Usar para sync diario. |

### Sync diario de partidos
```bash
curl "http://localhost:3000/api/sync-matches?secret=mundi2026"
# → {"synced":104,"total":104}
```
Fuente: `https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json`

---

## Estructura de archivos relevantes

```
src/
├── app/
│   ├── page.tsx                        # Landing
│   ├── layout.tsx                      # Root layout
│   ├── register/page.tsx               # Registro bar (2 pasos + geocoding)
│   ├── login/page.tsx                  # Login bar
│   ├── dashboard/page.tsx              # Panel bar (server, pasa datos a componentes cliente)
│   ├── main/
│   │   ├── page.tsx                    # Server: fetch matches + bars con bar_matches
│   │   └── MainView.tsx                # Client: mapa + carrusel de partidos
│   └── api/
│       ├── auth/signout/route.ts
│       └── sync-matches/route.ts
├── components/
│   ├── dashboard/
│   │   ├── BarMatchesSection.tsx       # Client: modal selección de partidos
│   │   └── BarPhotosSection.tsx        # Client: upload fotos a Supabase Storage
│   ├── map/
│   │   └── MapComponent.tsx            # Client: Leaflet map (SSR disabled)
│   └── ui/
│       ├── AddressAutocomplete.tsx     # Autocomplete con Nominatim
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Flag.tsx                    # Bandera de país via flagcdn.com
│       └── Input.tsx
├── lib/
│   ├── flags.ts                        # Mapeo equipo→emoji y equipo→código ISO
│   ├── supabase.ts                     # Browser client
│   └── supabase-server.ts             # Server client (cookies SSR)
└── types/index.ts                      # Bar, Match, BarMatch
```

---

## Funcionalidades implementadas

### Para bares
- [x] Registro en 2 pasos: cuenta (email/password) + perfil (descripción, dirección con autocomplete, teléfono, web)
- [x] Dirección con sugerencias reales de OpenStreetMap → guarda lat/lng automáticamente
- [x] Login / logout
- [x] Dashboard: ver perfil actual
- [x] Dashboard: seleccionar partidos a emitir (modal con 104 partidos agrupados por fase + buscador)
- [x] Dashboard: subir hasta 6 fotos del local a Supabase Storage

### Para fans
- [x] Mapa real (Leaflet + CartoDB Voyager) centrado en ubicación del dispositivo
- [x] Carrusel de 104 partidos reales del Mundial 2026 ordenados por fecha
- [x] Equipo favorito: el partido más cercano del favorito aparece primero
- [x] Al seleccionar partido → marcadores 🍺 de bares que lo emiten
- [x] Card del bar: nombre, dirección, teléfono, descripción
- [x] Botón "Cómo llegar en Google Maps" → abre Google Maps con coordenadas exactas
- [x] Banderas reales de países via flagcdn.com

### Infraestructura
- [x] 104 partidos sembrados desde openfootball (fechas y horas en UTC)
- [x] Endpoint de sync diario `/api/sync-matches`
- [x] Horas mostradas en hora local del dispositivo del usuario

---

## Pendiente / próximos pasos

- [ ] **Pendiente de verificar**: bug donde partidos seleccionados en el dashboard no se guardan correctamente (RLS fix en migration 002, pendiente de probar)
- [ ] **Bucket bar-photos**: crear manualmente en Supabase → Storage → New bucket → `bar-photos` (público)
- [ ] Editar perfil del bar desde el dashboard (botón existe pero no funcional)
- [ ] Bares reales en el mapa con sus fotos
- [ ] Filtro por ciudad / zona en el mapa
- [ ] Device ID para fans (identificación sin registro)
- [ ] Página de detalle del bar
- [ ] Reviews / valoraciones de bares

---

## Notas importantes

- Las claves de Supabase **nunca** van al repositorio (`.env.local` está en `.gitignore`)
- El mapa usa `dynamic(() => import(...), { ssr: false })` — Leaflet no funciona en SSR
- Los partidos de fase eliminatoria tienen `home_team`/`away_team` como `W73`, `L45` etc. (por determinar)
- Marti y Tono trabajan en `main` directamente — hacer `git pull --rebase` antes de pushear para evitar conflictos
- Cuando hay conflicto en un archivo, siempre mergear manualmente preservando cambios de ambos
