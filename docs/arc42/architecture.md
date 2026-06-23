# Documento de Arquitectura (arc42) — multiverseofmadness.me

> Sitio personal de Luis Miguel Medina, desplegado en GitHub Pages bajo el dominio
> personalizado `multiverseofmadness.me`. SPA construida con React 19 + Vite 8.
>
> **Estado:** vivo / en evolución. La decisión central documentada aquí es la
> **convención de rutas** `home/{artist}/{page}` (ver sección 9, ADR-0001).
>
> **Idioma:** español. **Plantilla:** arc42 (12 secciones).

---

## 1. Introducción y Objetivos

`multiverseofmadness.me` es el sitio personal del propietario. Funciona como un
*roster* tipo "Lumivox": una tira de artistas seleccionables; al elegir un artista
se muestra su página dedicada (sus *modules*: brief, redes, web, o un *portal*).

Hoy existen dos artistas en `MoM-web/src/data/artists.ts`:

- **`luis-m` (Luis.M):** su página *es* el portal "Multiverse Of Madness". Tiene un
  módulo `portal` que apunta a la ruta canónica `/home/luis-m/multiverse-of-madness`.
  A futuro, este portal re-incorpora el viejo panel de administración Angular
  (login/registro + app con guard de Firebase).
- **`joz` (Joz):** ilustradora freelance; su página será un *commission builder*
  (cambio OpenSpec `joz-commission-builder`). Aún sin ruta dedicada.

### 1.1 Objetivos de calidad (Top 3)

| # | Objetivo | Por qué importa |
|---|----------|-----------------|
| 1 | **Rutas predecibles y consistentes** | El propietario fija una convención única `home/{artist}/{page}` para todo el sitio; las URLs deben ser deducibles a partir del artista y la página. |
| 2 | **Compatibilidad de enlaces (deep links)** | Es un SPA en GitHub Pages; los enlaces profundos y los marcadores antiguos deben seguir resolviendo (fallback `404.html` + redirecciones de retrocompatibilidad). |
| 3 | **Bajo coste de mantenimiento** | Proyecto personal de una persona. La arquitectura debe ser lean: cero backend propio, despliegue automático, mínima ceremonia. |

### 1.2 Stakeholders

| Rol | Interés |
|-----|---------|
| Propietario (Luis.M) | Dueño del producto, desarrollador y autor de las decisiones. |
| Joz (artista) | Su página/commission builder vive dentro del roster. |
| Visitantes | Navegan el roster y las páginas de artistas. |

---

## 2. Restricciones (Constraints)

| Tipo | Restricción |
|------|-------------|
| Hosting | **GitHub Pages** (estático). No hay servidor propio ni capacidad de redirecciones HTTP del lado servidor: todo redireccionamiento y *routing* es del lado cliente. |
| Dominio | Dominio personalizado `multiverseofmadness.me` vía fichero `CNAME` en la raíz del repo. |
| SPA / deep links | `createBrowserRouter` usa rutas reales (HTML5 history). En Pages se requiere un `404.html` que sirva de fallback para que los deep links no devuelvan un 404 real. |
| Stack fijo | React 19, Vite 8, `react-router-dom` v7, TypeScript, Bootstrap 5, SCSS. |
| Build/deploy | GitHub Actions (`.github/workflows/deploy.yml`): `npm ci` + `npm run build:gh-pages` en `./MoM-web`, sube `./MoM-web/dist` a Pages. Node 20. |
| Auth | El futuro portal usa Firebase Realtime DB con niveles de permiso 1..4. Al ser un host estático, **es soft-gating de UX, no una frontera de seguridad real** (ver sección 8 y riesgos). |
| Equipo | Una sola persona. Sin proceso pesado. |

---

## 3. Contexto y Alcance (Context & Scope)

### 3.1 Contexto de negocio

```mermaid
graph LR
  V[Visitante anonimo]
  A[Usuario autenticado del portal]
  O[Propietario / Editor de datos]

  subgraph Sistema["multiverseofmadness.me (SPA en GitHub Pages)"]
    R["Roster Lumivox (/home)<br/>Paginas de artista (/home/{artist}/...)<br/>Portal MoM (futuro: login/app)"]
  end

  GH[(GitHub Pages<br/>hosting estatico)]
  FB[(Firebase Realtime DB<br/>auth + datos del portal - futuro)]

  V -->|navega roster y paginas| R
  A -->|login + usa app protegida| R
  O -->|edita artists.ts y despliega| R
  R -->|servida como estatica| GH
  R -.->|valida credenciales en cliente| FB
```

- **Entrada:** navegador del visitante.
- **Dependencia externa (futura):** Firebase Realtime DB para el portal de Luis.M.
- **Fuera de alcance:** cualquier backend propio, pagos, e-commerce real.

### 3.2 Contexto técnico

| Interfaz | Detalle |
|----------|---------|
| HTTP (estático) | GitHub Pages sirve los artefactos de `dist`. |
| Routing cliente | `react-router-dom` v7 (`createBrowserRouter`) en `MoM-web/src/main.tsx`. |
| Firebase (futuro) | SDK cliente desde el bundle, autenticación y lectura/escritura del portal. |

---

## 4. Estrategia de Solución (Solution Strategy)

- **SPA estática, sin backend propio.** Toda la lógica vive en el cliente; el estado del portal se delega a Firebase.
- **Routing declarativo centralizado** en `main.tsx` con `createBrowserRouter`. Una única convención de URL (`home/{artist}/{page}`) gobierna todas las rutas de página — ver ADR-0001.
- **El roster es el índice.** `/home` lista los artistas; cada artista expone sus páginas bajo `/home/{artist}/{page}`. Las páginas internas del portal extienden esa base. Las únicas rutas exentas del segmento `{artist}` son `/home` (el roster) y las rutas que sólo redirigen: `/` → `/home` y `*` → `/home`.
- **Migración 1:1 del panel Angular** a React Router preservando los segmentos de ruta originales (incluido el segmento `app` y los slugs en español) para poder mapear redirecciones antiguas → nuevas de forma trivial.
- **Despliegue automático** vía GitHub Actions en cada push a `main`; `404.html` (generado por `generate-404.js`) como fallback de deep links.

---

## 5. Vista de Bloques de Construcción (Building Block View)

### 5.1 Nivel 1 — Caja blanca del SPA

```mermaid
graph TD
  subgraph MoM["MoM-web (SPA React)"]
    MAIN["main.tsx<br/>composition root - createBrowserRouter"]
    DATA[("data/artists.ts<br/>roster: handle - displayName - modules")]
    STYLES["styles.scss<br/>Bootstrap 5 + SCSS"]
    subgraph PAGES["pages/"]
      HP["LumivoxHomePage<br/>roster a /home"]
      MOM["MultiverseOfMadnessPage<br/>landing portal MoM (placeholder hoy)"]
      JOZ["JozCommissionBuilderPage<br/>+ CommissionBuilder (planificado)"]
    end
    DIST[("dist/<br/>artefacto build a Pages")]
  end

  MAIN --> PAGES
  PAGES --> DATA
  MAIN --> STYLES
  MAIN -->|vite build| DIST
```

| Bloque | Responsabilidad |
|--------|-----------------|
| `main.tsx` | Define el árbol de rutas y monta `RouterProvider`. Punto único donde se materializa la convención de rutas. |
| `data/artists.ts` | Define los artistas. El campo `handle` es el **slug canónico del artista** (segmento `{artist}`). El módulo `portal` contiene la `route` que debe alinearse con la convención. |
| `pages/LumivoxHomePage` | Renderiza el roster. Mapea a `/home`. |
| `pages/MultiverseOfMadnessPage` | Landing del portal de Luis.M. Mapea a `/home/luis-m/multiverse-of-madness`. |

### 5.2 Nivel 2 — Subárbol del portal MoM (planificado)

El portal de Luis.M (re-migrado desde Angular) se modela como un subárbol bajo
`/home/luis-m/multiverse-of-madness`:

- **Base (pública):** landing/marketing.
- **Entrada pública:** `login`, `register` (hijos directos de la base).
- **Aplicación protegida:** segmento `app` (shell `Layout` + guard de Firebase, `Outlet`), con páginas hijas: `dashboard`, `profile`, `logs`, `monitoreo`, `anuncios`, `directorio`, `misiones`, `articulos`, `settings`.

La topología exacta de rutas es la tabla autoritativa del ADR-0001 (sección 9).

---

## 6. Vista en Tiempo de Ejecución (Runtime View)

### 6.1 Escenario: visitante abre un enlace profundo a una página de artista

1. El navegador pide `https://multiverseofmadness.me/home/luis-m/multiverse-of-madness`.
2. GitHub Pages no encuentra ese path estático → sirve `404.html` (fallback SPA).
3. El bundle arranca, `createBrowserRouter` resuelve el path actual y renderiza `MultiverseOfMadnessPage`.

### 6.2 Escenario: redirección de retrocompatibilidad

1. Marcador antiguo `/multiverse-of-madness`.
2. El router lo intercepta (`<Navigate replace>`) y emite un *redirect* a `/home/luis-m/multiverse-of-madness`.
3. La URL canónica queda en la barra de direcciones.

### 6.3 Escenario: acceso al subárbol protegido (futuro)

1. Visitante navega a `.../dashboard`.
2. El guard sin ruta (`ProtectedRoute`) comprueba la sesión.
3. Si no autenticado → redirige a `.../login`. Si autenticado → `Layout` (`Outlet`) renderiza la página hija.

---

## 7. Vista de Despliegue (Deployment View)

```mermaid
graph TD
  PUSH["push a main / workflow_dispatch"] --> CI["GitHub Actions (deploy.yml)"]
  CI --> NODE["setup-node@v4 (Node 20, cache npm)"]
  NODE --> CINSTALL["npm ci (working-dir: ./MoM-web)"]
  CINSTALL --> BUILD["npm run build:gh-pages<br/>(vite build + generate-404.js)"]
  BUILD --> UP["upload-pages-artifact (path: ./MoM-web/dist)"]
  UP --> DEPLOY["deploy-pages@v4"]
  DEPLOY --> PAGES["GitHub Pages a multiverseofmadness.me (CNAME)"]
```

| Elemento | Valor |
|----------|-------|
| Trigger | `push` a `main` + `workflow_dispatch`. |
| Build | `npm run build:gh-pages` en `./MoM-web` (`vite build` + `generate-404.js`). |
| Artefacto | `./MoM-web/dist`. |
| Dominio | `multiverseofmadness.me` (fichero `CNAME`, `.nojekyll` presente). |
| Concurrencia | grupo `pages`, sin cancelar en progreso. |

---

## 8. Conceptos Transversales (Crosscutting Concepts)

### 8.1 Routing (concepto central)

El routing es el concepto transversal dominante de este proyecto. Reglas:

- **Convención única:** toda ruta de página cumple literalmente `/home/{artist}/{page}` (ver ADR-0001 para la regla, el algoritmo de slug y la tabla completa).
- **`{artist}` = `handle` verbatim** de `artists.ts` (los handles SON los slugs canónicos de artista; no se recalculan).
- **`{page}` = slug kebab-case** del `displayName` de la página, según el algoritmo de slug del ADR-0001.
- **Subpáginas** (portal/app) extienden la base con segmentos kebab-case adicionales.
- **Exenciones:** sólo están exentos del segmento `{artist}` el roster `/home` y las rutas que únicamente redirigen — `/` → `/home` y el comodín `*` → `/home` —. Estas dos últimas no son rutas de página, sino redirecciones canónicas (ver tabla y árbol del ADR-0001).
- **Fuente de verdad de rutas:** `MoM-web/src/main.tsx`. La `route` del módulo `portal` en `artists.ts` ya está alineada (`/home/luis-m/multiverse-of-madness`) y debe mantenerse sincronizada al añadir páginas.

### 8.2 Deep links en host estático

`404.html` (generado en build por `generate-404.js`) sirve de fallback para que `createBrowserRouter` (history API) resuelva cualquier path en cliente. `.nojekyll` evita el procesamiento Jekyll.

### 8.3 Autenticación (futuro portal)

Firebase Realtime DB con niveles de permiso 1..4. **Al ser un host estático y un bundle público, esto es soft-gating de UX, no una frontera de seguridad.** Todo el código de rutas y la lógica del cliente son descargables. No deben colocarse secretos ni datos sensibles tras este "guard".

### 8.4 Estilos

Bootstrap 5 + SCSS global (`styles.scss`). Sin sistema de diseño formal por ahora.

---

## 9. Decisiones de Arquitectura (Architecture Decisions)

### ADR-0001: Convención de estructura de rutas (`home/{artist}/{page}`)

**Estado:** Aceptada (implementada en parte) · **Fecha:** 2026-06-23 · **Decisor:** Propietario (Luis.M)

#### Contexto

El sitio crecerá: la página de Joz (commission builder) necesitará ruta propia, y
el viejo panel Angular (login/registro + app con guard Firebase, niveles 1..4) será
re-migrado a React. Sin una convención, cada página inventaría su propio path,
produciendo URLs inconsistentes y enlaces frágiles.

Históricamente, `main.tsx` definía tres rutas planas y ad-hoc (`/` → roster,
`/multiverse-of-madness` → portal, `*` → roster). El propietario fija una regla de
calidad de rutas: **toda ruta de página debe seguir el patrón
`home/{artist-name}/{page-name}`**. Ejemplo dado: artista "Luis. M" + página
"MultiverseOfMadness" → `/home/luis-m/multiverse-of-madness`.

El núcleo de la convención ya está implementado en `main.tsx`:

```ts
// Route convention: /home/{artist}/{page} — see docs/arc42 (ADR-0001).
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/home" replace /> },
  { path: '/home', element: <LumivoxHomePage /> },
  { path: '/home/luis-m/multiverse-of-madness', element: <MultiverseOfMadnessPage /> },
  // Back-compat: old flat route -> canonical home/{artist}/{page}
  { path: '/multiverse-of-madness', element: <Navigate to="/home/luis-m/multiverse-of-madness" replace /> },
  { path: '*', element: <Navigate to="/home" replace /> },
]);
```

El resto de la tabla (página de Joz y subárbol del portal Angular) está pendiente
de implementar conforme avance la migración.

#### Decisión

Adoptar la convención `/home/{artist}/{page}` para **todas** las rutas de página,
con las reglas, el algoritmo de slug, la tabla de rutas, el anidamiento del portal y
las redirecciones de retrocompatibilidad que siguen.

##### Regla de nomenclatura

> Toda ruta de página DEBE coincidir literalmente con el patrón `/home/{artist}/{page}`,
> donde `{artist}` es el campo `handle` del artista en `artists.ts` (kebab-case) y
> `{page}` es el slug kebab-case del nombre visible de la página. Las subpáginas del
> portal/app extienden esa base añadiendo más segmentos kebab-case
> (`/home/{artist}/{page}/{sub-page}`). Quedan exentos del segmento `{artist}`
> únicamente el roster `/home` y las rutas que sólo redirigen y no renderizan
> contenido propio: `/` → `/home` y el comodín `*` → `/home`.

##### Algoritmo de slug

1. Pasar el nombre visible a minúsculas.
2. Normalizar/eliminar diacríticos vía Unicode **NFD** y quitar marcas combinantes (p. ej. `"José"` → `"jose"`).
3. Reemplazar `"&"` por `"and"`.
4. Reemplazar cada secuencia de caracteres no alfanuméricos (espacios, puntos, guiones bajos, barras) por un único guion.
5. Colapsar guiones repetidos y recortar guiones al inicio/final.

**Ejemplos:** `"Luis. M"` → `luis-m`; `"MultiverseOfMadness"` / `"Multiverse Of Madness"` → `multiverse-of-madness` (ojo: el camelCase **no** se separa automáticamente, así que el nombre origen debe contener ya los cortes de palabra o el slug se trata como un único token); `"Joz"` → `joz`; `"Monitoreo"` → `monitoreo`.

> El segmento de artista se toma **verbatim** del campo `handle` existente en lugar de
> recalcularse; por tanto los `handle` SON los slugs canónicos de artista.

##### Tabla de rutas (autoritativa)

| Path | Artist | Page | Estado | Renderiza / Mapea a | Notas |
|------|--------|------|--------|---------------------|-------|
| `/` | (ninguno) | (redirect) | **implementado** | Redirect (replace) a `/home` | Raíz = redirect canónico, no página. Exento de `{artist}` por ser sólo redirección. |
| `/home` | (ninguno) | Home | **implementado** | `LumivoxHomePage` (tira del roster) | El roster. Exento del segmento `{artist}` por ser el índice sobre todos los artistas. |
| `/home/luis-m/multiverse-of-madness` | luis-m | Multiverse Of Madness | **implementado** | Redirect (replace) a `.../login` | Base del portal. El índice redirige al gate de login (fiel al `/` → `/login` del Angular original). `MultiverseOfMadnessPage` queda como componente sin rutear (ver riesgos). La `route` del módulo `portal` en `artists.ts` apunta a este path. |
| `/home/joz/commission-builder` | joz | Commission Builder | planificado | `JozCommissionBuilderPage` envolviendo `<CommissionBuilder/>` | Joz hoy NO tiene ruta dedicada (el builder es inline en el roster según `joz-commission-builder`). Slug de la página pendiente de confirmación — ver preguntas abiertas. |
| `/home/luis-m/multiverse-of-madness/login` | luis-m | Multiverse Of Madness | **implementado** | `Login` (migrado a React) | PÚBLICA (gate de login, no auth-guarded). Antiguo `/login` Angular. Hermana de `register`. |
| `/home/luis-m/multiverse-of-madness/register` | luis-m | Multiverse Of Madness | **implementado** | `Register` (migrado a React) | PÚBLICA. Antiguo `/register` Angular. |
| _(sin segmento de URL)_ | luis-m | Multiverse Of Madness | **implementado** | `ProtectedRoute` → `Layout` (auth-guarded vía Firebase, niveles 1..4) | AUTH-GUARDED. **Guard sin ruta** (*pathless layout route* de React Router): da la frontera única del subárbol protegido SIN añadir segmento `/app` a la URL. Las páginas cuelgan directamente de la base del portal. |
| `/home/luis-m/multiverse-of-madness/dashboard` | luis-m | Multiverse Of Madness | **implementado** | `Dashboard` (migrado) | AUTH-GUARDED. Destino del login. |
| `/home/luis-m/multiverse-of-madness/profile` | luis-m | Multiverse Of Madness | **implementado** | `Profile` (migrado) | AUTH-GUARDED. |
| `/home/luis-m/multiverse-of-madness/logs` | luis-m | Multiverse Of Madness | **implementado** | `Logs` (migrado del componente Table) | AUTH-GUARDED. `logs` = componente Table. Slug inglés conservado del Angular. |
| `/home/luis-m/multiverse-of-madness/monitoreo` | luis-m | Multiverse Of Madness | **implementado** | `Players` (migrado) | AUTH-GUARDED. `monitoreo` = componente Players. Slug conservado verbatim del Angular. |
| `/home/luis-m/multiverse-of-madness/anuncios` | luis-m | Multiverse Of Madness | **implementado** | `Anuncios` (migrado) | AUTH-GUARDED. Slug español conservado del Angular. |
| `/home/luis-m/multiverse-of-madness/directorio` | luis-m | Multiverse Of Madness | **implementado** | `Directorio` (migrado) | AUTH-GUARDED. Slug español conservado del Angular. |
| `/home/luis-m/multiverse-of-madness/misiones` | luis-m | Multiverse Of Madness | **implementado** | `Misiones` (migrado) | AUTH-GUARDED. Slug español conservado del Angular. |
| `/home/luis-m/multiverse-of-madness/articulos` | luis-m | Multiverse Of Madness | **implementado** | `Articulos` (migrado) | AUTH-GUARDED. Slug español conservado del Angular (`articulos`, acento eliminado). |
| `/home/luis-m/multiverse-of-madness/settings` | luis-m | Multiverse Of Madness | **implementado** | `Settings` (migrado) | AUTH-GUARDED. |
| `/multiverse-of-madness` | luis-m | Multiverse Of Madness | **implementado** | Redirect (replace) a `/home/luis-m/multiverse-of-madness` | LEGACY plano. Ya redirige en `main.tsx`. Ver retrocompatibilidad. |
| `*` | (ninguno) | (fallback) | **implementado** | Redirect (replace) a `/home` | El wildcard redirige cualquier path desconocido a `/home`. Exento de `{artist}` por ser sólo redirección, no página. |

##### Anidamiento del portal

El portal MoM **es** la página de Luis.M, así que su base es
`/home/luis-m/multiverse-of-madness` (profundidad 3). Todas las páginas internas son
**hijas directas de la base** (profundidad 4) — URLs planas, sin segmento extra:

1. **Entrada PÚBLICA:** `.../login` y `.../register`.
2. **Aplicación AUTH-GUARDED:** `.../dashboard`, `.../profile`, `.../logs`,
   `.../monitoreo`, `.../anuncios`, `.../directorio`, `.../misiones`,
   `.../articulos`, `.../settings`.

La frontera del subárbol protegido NO es un segmento de URL sino un **guard sin ruta**
(*pathless layout route*): `ProtectedRoute` (redirige a `.../login` si no hay sesión)
envuelve a `Layout` (shell con `Outlet`), y las páginas protegidas cuelgan de él. Esto
descarta el segmento `/app` del Angular original: se obtiene la misma frontera única de
auth con URLs más cortas que cumplen literalmente `home/{artist}/{page}/{subpágina}`.
El índice de la base (`.../`) redirige a `.../login`; `login`/`register` quedan fuera del
guard para ser accesibles sin autenticación.

##### Redirecciones de retrocompatibilidad

| Desde | Hacia | Estado |
|-------|-------|--------|
| `/` | `/home` | implementado |
| `/multiverse-of-madness` | `/home/luis-m/multiverse-of-madness` | implementado |
| `*` (path desconocido) | `/home` | implementado |

> Nota: los deep links del Angular original (`/login`, `/register`, `/app/*` servidos
> en la raíz del dominio) hoy **no** tienen redirect dedicado — caen en el comodín
> `*` → `/home`. No se añadieron porque el portal Angular estaba login-gated (no eran
> URLs marcables sin sesión). Si hace falta, se pueden mapear 1:1 a `.../login` y
> `.../<página>`.

##### Árbol de rutas (visión global)

```mermaid
graph TD
  ROOT["/ a redirect (replace)"] --> HOME["/home (roster - LumivoxHomePage)"]
  HOME --> LM["/home/luis-m/multiverse-of-madness<br/>(landing publica MoM)"]
  HOME --> JZ["/home/joz/commission-builder (planificado)"]
  LM -->|"index a redirect"| LOGIN["login (publico)"]
  LM --> REG["register (publico)"]
  LM --> GUARD["ProtectedRoute + Layout<br/>(guard sin ruta, sin segmento URL)"]
  GUARD --> DASH[dashboard]
  GUARD --> PROF[profile]
  GUARD --> LOGS["logs (Table)"]
  GUARD --> MON["monitoreo (Players)"]
  GUARD --> ANU[anuncios]
  GUARD --> DIR[directorio]
  GUARD --> MIS[misiones]
  GUARD --> ART[articulos]
  GUARD --> SET[settings]
  WILD["* a redirect /home"]
```

#### Consecuencias

**Positivas:**
- URLs predecibles y deducibles a partir de `handle` + nombre de página.
- El roster es un índice claro (`/home`) y cada artista tiene un espacio de nombres propio (`/home/{artist}/...`).
- La migración Angular preservó los slugs de página → URLs predecibles. El segmento `/app` se descartó a favor de un guard sin ruta (URLs más cortas, misma frontera de auth).
- Una sola URL canónica para home (`/home`), con `/` y `*` redirigiendo a ella.

> **Estado de implementación (2026-06-23):** el portal MoM ya está re-migrado a React y
> vivo bajo `/home/luis-m/multiverse-of-madness` (login + las 9 páginas protegidas). La
> estructura final es **plana con guard sin ruta**, no el segmento `/app` que se barajó
> en el diseño inicial.

**Negativas / costes:**
- URLs largas en el portal (el slug `multiverse-of-madness` se repite en todas las subrutas).
- El redirect `/` → `/home` añade un salto extra frente a renderizar el roster directamente en `/`.
- Mantener `artists.ts` (`handle`, `portal.route`) sincronizado con `main.tsx` es responsabilidad manual.
- Persisten slugs mixtos ES/EN en el portal (`monitoreo`/`anuncios` vs `login`/`dashboard`).

#### Alternativas consideradas

1. **Rutas planas ad-hoc (statu quo previo):** `/multiverse-of-madness`, `/login`, etc. Rechazada: no escala, sin namespacing por artista, URLs inconsistentes.
2. **`/{artist}/{page}` sin prefijo `home`:** más corto, pero colisiona el namespace del artista con rutas top-level y no deja un índice explícito del roster; el propietario pidió explícitamente el prefijo `home`.
3. **Hash routing (`/#/...`):** evitaría el `404.html` en Pages, pero produce URLs feas y peor SEO/compartibilidad. Rechazada.
4. **Normalizar todos los slugs del portal a un solo idioma:** rompería el mapa de redirecciones antiguas 1:1. Diferida (ver preguntas abiertas).

#### Preguntas abiertas (a confirmar con el propietario)

1. ¿`/` debe seguir REDIRIGIENDO a `/home` (estado actual) o RENDERIZAR el roster directamente para evitar el salto extra? (Hoy redirige).
2. Slug de la página de Joz: ¿`Commission Builder` (→ `/home/joz/commission-builder`) o algo de marca como `Studio`/`Shop`? El cambio `joz-commission-builder` difiere la ruta dedicada.
3. Consistencia de idioma de slugs del portal (preservar verbatim ES/EN vs normalizar). Normalizar rompe el mapa de redirecciones simple.
4. ¿`logs`/`monitoreo` derivan del nombre de RUTA (Angular) o del COMPONENTE (Table/Players)? El brief usó nombres de componente.
5. ¿La landing pública del MoM sobrevive como base del portal, o la base pasa a estar login-gated cuando llegue el portal real?
6. ¿El segmento `{page}` (`multiverse-of-madness`) debe mantenerse constante en TODAS las subrutas, o las páginas profundas pueden soltarlo?
7. Modelo de auth en host estático: confirmar que Firebase niveles 1..4 es soft-gating de UX, no frontera de seguridad (todo el bundle es público).
8. ¿Tarjetas de artista que NO son páginas completas (solo redes) deben acuñar una ruta `/home/{artist}`, o `{artist}` solo aparece cuando existe al menos una `{page}`?

---

### ADR-0002: SPA con fallback `404.html` en GitHub Pages

**Estado:** Aceptada · **Fecha:** 2026-06-23 · **Decisor:** Propietario (Luis.M)

#### Contexto

GitHub Pages es un host estático que no puede reescribir rutas del lado servidor; un deep link a una subruta del SPA (`/home/...`) devolvería un 404 real.

#### Decisión

Usar `createBrowserRouter` (history API, URLs limpias) y generar un `404.html` en build (`generate-404.js`) que sirva el mismo bundle como fallback, de modo que el router resuelva el path en el cliente. Mantener `.nojekyll` y `CNAME` en el artefacto.

#### Consecuencias

URLs limpias y compartibles, alineadas con la convención `/home/{artist}/{page}` del ADR-0001; a cambio, cada deep link "frío" pasa por el 404 de Pages antes de hidratar el SPA.

#### Alternativas consideradas

1. **Hash routing (`/#/...`):** evitaría por completo el `404.html` porque el fragmento nunca llega al servidor. Rechazada por estética de URL y peor SEO/compartibilidad (coherente con ADR-0001, alternativa 3).
2. **Pre-render / SSG de cada ruta a un `.html` físico:** eliminaría el salto por el 404 para rutas conocidas. Rechazada: añade complejidad de build y un paso de generación por ruta para un SPA estático mantenido por una sola persona, y no cubre rutas dinámicas (`/home/{artist}/...`) sin enumerarlas.

---

### ADR-0003: Autenticación del portal como soft-gating (Firebase, cliente)

**Estado:** Aceptada · **Fecha:** 2026-06-23 · **Decisor:** Propietario (Luis.M)

#### Contexto

El portal re-migrado de Angular usa Firebase Realtime DB con niveles de permiso 1..4. El sitio es un bundle estático y público.

#### Decisión

Tratar el guard del segmento `app` como **soft-gating de UX**, no como una frontera de seguridad. No colocar secretos ni datos sensibles tras el guard; cualquier dato que deba protegerse de verdad debe asegurarse por reglas de Firebase del lado servidor, no por el routing del cliente.

#### Consecuencias

Experiencia de "área privada" sin backend propio; a cambio, la confidencialidad real depende de las reglas de Firebase, no del SPA. Ver sección 8.3 y riesgo #1.

#### Alternativas consideradas

1. **Backend/serverless propio para autenticar y autorizar:** sería una frontera de seguridad real. Rechazada: rompe la restricción de cero-backend (sección 2) y el objetivo de bajo coste de mantenimiento.
2. **Sin gating: portal totalmente público:** más simple. Rechazada: el propietario quiere una UX de "área privada" diferenciada para el portal.
3. **Reglas de seguridad de Firebase del lado servidor como única frontera real:** adoptada como complemento, no alternativa — el routing del cliente sólo aporta la UX de gating, y toda confidencialidad efectiva recae en estas reglas.

---

## 10. Requisitos de Calidad (Quality Requirements)

| Atributo | Escenario / criterio |
|----------|----------------------|
| **Consistencia de rutas** | Toda nueva página añadida cumple `home/{artist}/{page}`; un revisor puede deducir la URL de cualquier página solo con el `handle` y el nombre. |
| **Compatibilidad de enlaces** | Cualquier URL antigua de la tabla de retrocompatibilidad resuelve (redirect) a su equivalente nuevo sin 404. |
| **Mantenibilidad** | Añadir un artista/página requiere editar solo `artists.ts` y `main.tsx`; despliegue automático en push a `main`. |
| **Rendimiento** | Carga estática desde CDN de GitHub Pages; SPA con bundle único de Vite. |

---

## 11. Riesgos y Deuda Técnica (Risks & Technical Debt)

| # | Riesgo / Deuda | Mitigación |
|---|----------------|------------|
| 0 | **🔴 Contraseñas de admin públicas:** `system/admins.json` de la Realtime DB se lee SIN autenticación (HTTP 200 abierto), exponiendo usuarios **y contraseñas** en claro a cualquiera. Verificado el 2026-06-23. | **Urgente:** endurecer las reglas de seguridad de Firebase (denegar lectura de `system/admins`), mover la verificación de credenciales a un backend/Cloud Function, y hashear las contraseñas. Mientras tanto, no usar contraseñas reutilizadas. |
| 1 | **Auth "falsa" en host estático:** Firebase niveles 1..4 es client-side; no protege datos (ADR-0003). | Tratar como soft-gating de UX; no almacenar secretos/datos sensibles tras el guard; usar reglas de Firebase del lado servidor. |
| 2 | **Sincronía `artists.ts` ↔ `main.tsx`:** la `route` del `portal` ya está alineada, pero la duplicación es manual y puede divergir al añadir páginas. | Idealmente derivar la ruta de un helper común a partir de `handle` + slug de página. |
| 3 | **Slugs mixtos ES/EN** en el portal generan inconsistencia. | Decisión diferida (ADR-0001, pregunta abierta 3). |
| 4 | **Datos placeholder** (`Lorem ipsum`, URLs `example`, TODOs) en `artists.ts`. | Confirmar contenido real con Luis.M y Joz. |
| 5 | **Migración Angular: COMPLETADA** (2026-06-23) — portada a React en `src/portal/`. El Angular original queda solo en historial git (referencia local en `.legacy-angular/`, gitignored). | — |
| 6 | **URLs largas** del portal por repetir `multiverse-of-madness`. | Aceptado por ahora (ADR-0001, pregunta abierta 6). |

---

## 12. Glosario (Glossary)

| Término | Definición |
|---------|------------|
| **arc42** | Plantilla de documentación de arquitectura de 12 secciones. |
| **ADR** | Architecture Decision Record. Registro de una decisión de arquitectura con contexto, decisión, consecuencias y alternativas. |
| **Roster / Lumivox** | La tira de artistas seleccionables; el índice del sitio (`/home`). |
| **handle** | Identificador kebab-case del artista en `artists.ts` (`luis-m`, `joz`). Slug canónico del segmento `{artist}`. |
| **slug** | Forma kebab-case y sin diacríticos de un nombre, usada como segmento de URL. |
| **Portal (MoM)** | La página de Luis.M = "Multiverse Of Madness"; subárbol con landing pública, login/registro y app protegida. |
| **Commission builder** | La página/herramienta de Joz para construir encargos (cambio OpenSpec `joz-commission-builder`). |
| **Auth-guarded** | Subárbol (`app`) accesible solo tras autenticación (guard Firebase). |
| **Login-gated (público)** | Páginas (`login`, `register`) públicas que dan acceso al subárbol protegido. |
| **Soft-gating** | Restricción de UX del lado cliente que NO constituye una frontera de seguridad real. |
| **SPA** | Single Page Application. |
| **Deep link** | URL profunda que apunta directamente a una subruta del SPA. |
| **`404.html`** | Fallback en GitHub Pages que permite resolver deep links en el cliente. |
| **back-compat** | Retrocompatibilidad: mapa de URLs antiguas → nuevas vía redirect. |