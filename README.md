# Medabots Repository

Un laboratorio de persistencia para entender **qué hace un Repository** y cómo se conecta con PostgreSQL a través de Drizzle ORM.

El foco **no** es construir una API completa, sino observar el efecto real de cada operación de persistencia en la base de datos: cómo el código TypeScript se traduce en SQL, y cómo ese SQL modifica filas en PostgreSQL.

---

## 🎯 Objetivo pedagógico

Este proyecto explora la cadena:

```
main.ts → MedabotRepository → Drizzle ORM → SQL → PostgreSQL (Neon)
```

Cada capa tiene una responsabilidad clara y aislada:

| Capa | Responsabilidad |
|---|---|
| `main.ts` | Laboratorio de pruebas. Ejecuta operaciones y muestra resultados. |
| `MedabotRepository` | Encapsula el acceso a datos. No sabe de HTTP ni de reglas de negocio. |
| Drizzle ORM | Traduce TypeScript a SQL tipado. |
| PostgreSQL (Neon) | Almacena los datos. |

---

## 🧰 Stack

- **Node.js** + **TypeScript**
- **pnpm** (gestor de paquetes)
- **Drizzle ORM** + **Drizzle Kit** (schema y migraciones)
- **pg** (driver oficial de PostgreSQL para Node)
- **Neon** (PostgreSQL serverless, plan gratuito)
- **tsx** (ejecución directa de TypeScript en desarrollo)
- **dotenv** (variables de entorno)
- **Hono** (disponible para la evolución futura del proyecto)

---

## 🗂️ Estructura

```
medabots-repository/
├── drizzle/
├── src/
│   ├── controllers/
│   │   └── medabot.controller.ts    # Rutas HTTP + validación Zod
│   ├── services/
│   │   └── medabot.service.ts       # Lógica de negocio
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── repositories/
│   │   └── medabot.repository.ts
│   ├── api.ts                        # Entry point del servidor Hono
│   └── main.ts                       # Laboratorio de persistencia
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.mdmedabots-repository/
├── drizzle/
├── src/
│   ├── controllers/
│   │   └── medabot.controller.ts    # Rutas HTTP + validación Zod
│   ├── services/
│   │   └── medabot.service.ts       # Lógica de negocio
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── repositories/
│   │   └── medabot.repository.ts
│   ├── api.ts                        # Entry point del servidor Hono
│   └── main.ts                       # Laboratorio de persistencia
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧬 Dominio: Medabots

Tabla `medabots`:

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | serial PK | Identificador autoincremental |
| `name` | varchar(100) | Nombre del Medabot |
| `medaforce` | varchar(100) | Habilidad especial |
| `type` | varchar(50) | Tipo (Escarabajo, Gato, etc.) |
| `head` | varchar(100) | Pieza de la cabeza |
| `left_arm` | varchar(100) | Brazo izquierdo |
| `right_arm` | varchar(100) | Brazo derecho |
| `legs` | varchar(100) | Piernas / movilidad |

---

## 🚀 Setup

### 1. Requisitos

- Node.js 20+
- pnpm
- Una cuenta en [Neon](https://neon.tech) (o cualquier PostgreSQL accesible)

### 2. Instalación

```bash
git clone <tu-repo>
cd medabots-repository
pnpm install
```

### 3. Variables de entorno

Copiá el archivo de ejemplo y completá con tus credenciales de Neon:

```bash
cp .env.example .env
```

```env
# Conexión pooled — usada por la aplicación en runtime
DATABASE_URL="postgresql://user:password@endpoint-pooler.region.aws.neon.tech/dbname?sslmode=require"

# Conexión directa — usada por Drizzle Kit para migraciones
DATABASE_URL_UNPOOLED="postgresql://user:password@endpoint.region.aws.neon.tech/dbname?sslmode=require"
```

> **Nota**: Neon ofrece dos cadenas de conexión. La `pooled` (con `-pooler`) es para la app. La `unpooled` es para migraciones, porque Drizzle Kit necesita comandos a nivel de sesión que PgBouncer no soporta.

### 4. Aplicar migraciones

```bash
pnpm db:migrate
```

### 5. Cargar datos de ejemplo

```bash
pnpm db:seed
```

### 6. Ejecutar el laboratorio

```bash
pnpm start
```

Vas a ver en consola cómo el script ejecuta un CRUD completo paso a paso. **Mientras corre, abrí el dashboard de Neon** y observá cómo cambian las filas en tiempo real.

---

## 📜 Scripts disponibles

| Script | Descripción |
|---|---|
| `pnpm dev:api` | Levanta la API en modo watch |
| `pnpm start:api` | Levanta la API una sola vez |
| `pnpm dev:lab` | Ejecuta el laboratorio en modo watch |
| `pnpm start:lab` | Ejecuta el laboratorio una sola vez |
| `pnpm typecheck` | Verifica tipos sin emitir archivos |
| `pnpm db:generate` | Genera una migración desde el schema |
| `pnpm db:migrate` | Aplica migraciones pendientes |
| `pnpm db:seed` | Carga datos de ejemplo |
| `pnpm db:studio` | Abre Drizzle Studio |

---

## 🧠 Conceptos clave

### ¿Qué es un Repository?

Una capa que **encapsula el acceso a datos**. Sus responsabilidades:

- Traducir operaciones de dominio a operaciones de persistencia.
- Ocultar los detalles de la base de datos al resto del sistema.
- Centralizar el acceso a una entidad (en este caso, `medabots`).

Lo que **no** hace un Repository:

- ❌ Validaciones de negocio → eso es del **Service**.
- ❌ HTTP, status codes, requests → eso es del **Controller**.
- ❌ Reglas del dominio ("un Medabot no puede...") → eso es del **Service**.

### ¿Por qué Drizzle?

- **Type-safe**: los tipos se infieren del schema, no se duplican.
- **SQL-like**: escribís casi SQL, pero en TypeScript.
- **Sin magia**: no hay "lazy loading" ni proxies ocultos. Lo que ves es lo que se ejecuta.

---
## 🌐 API HTTP (Hono)

El proyecto expone una API REST construida con **Hono** y validada con **Zod**.

### Arquitectura en capas

```
HTTP → Hono → Controller → Service → Repository → Drizzle → PostgreSQL
```

| Capa | Responsabilidad | ¿Qué NO hace? |
|---|---|---|
| **Controller** | Maneja request/response HTTP, valida entrada con Zod. | No contiene lógica de negocio. |
| **Service** | Lógica de negocio y orquestación. | No sabe de HTTP (no ve `req`/`res`). |
| **Repository** | Persistencia pura (CRUD). | No conoce reglas de dominio. |

### Levantar el servidor

```bash
pnpm dev:api
```

Por defecto escucha en `http://localhost:3000` (configurable con `PORT`).

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Health check (útil para Render) |
| `GET` | `/api/medabots` | Lista todos los Medabots |
| `GET` | `/api/medabots/:id` | Obtiene uno por ID (404 si no existe) |
| `POST` | `/api/medabots` | Crea uno nuevo (201 Created) |
| `PUT` | `/api/medabots/:id` | Actualiza parcialmente (404 si no existe) |
| `DELETE` | `/api/medabots/:id` | Elimina (204 No Content, 404 si no existe) |

### Ejemplos con `curl`

```bash
# Health check
curl http://localhost:3000/health

# Listar todos
curl http://localhost:3000/api/medabots

# Crear uno
curl -X POST http://localhost:3000/api/medabots \
  -H "Content-Type: application/json" \
  -d '{"name":"Metal Beetle","medaforce":"Beam","type":"Escarabajo","head":"Beam","leftArm":"Missile","rightArm":"Missile","legs":"Tank"}'

# Obtener por ID
curl http://localhost:3000/api/medabots/1

# Actualizar parcialmente
curl -X PUT http://localhost:3000/api/medabots/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Metal Beetle MK-II"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/medabots/1
```

### Validación con Zod

Todos los endpoints que reciben body (`POST`, `PUT`) validan la entrada contra un esquema Zod. Si el body no cumple, Hono devuelve `400 Bad Request` automáticamente vía `@hono/zod-validator`, antes de que el Service o la DB lo vean.

## 🗺️ Hoja de ruta

- [x] **Etapa 0** — Setup del proyecto (pnpm, TS, tsconfig, scripts)
- [x] **Etapa 1** — PostgreSQL en Neon + variables de entorno
- [x] **Etapa 2** — Schema + conexión con Drizzle
- [x] **Etapa 3** — Migraciones + datos de seed
- [x] **Etapa 4** — `MedabotRepository` con CRUD completo
- [x] **Etapa 5** — `main.ts` como laboratorio de persistencia
- [ ] **Etapa 6** — Evolución a API HTTP con Hono + Controller + Service
- [ ] **Etapa 7** — Empaquetado en Docker + despliegue en Render

---

## 📚 Referencias

- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon](https://neon.tech/docs)
- [pg (node-postgres)](https://node-postgres.com/)
- [Repository Pattern (Martin Fowler)](https://martinfowler.com/eaaCatalog/repository.html)

---

## 📄 Licencia

MIT