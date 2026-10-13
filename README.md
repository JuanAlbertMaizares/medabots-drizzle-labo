# Medabots Repository

Un laboratorio de persistencia y API HTTP para entender **qué hace un Repository**, cómo se conecta con PostgreSQL a través de Drizzle ORM, y cómo se lleva a producción con Docker y Render.

El foco **no** es construir un CRUD, sino observar el efecto real de cada operación en la base de datos: cómo el código TypeScript se traduce en SQL, y cómo ese SQL modifica filas en PostgreSQL.

🔗 **API en producción**: https://medabots-api-latest.onrender.com  
🩺 **Health check**: https://medabots-api-latest.onrender.com/health  
📦 **Listar Medabots**: https://medabots-api-latest.onrender.com/api/medabots

---

## 🎯 Objetivo pedagógico

Este proyecto explora la cadena completa de un backend real:

```
HTTP → Hono → Controller → Service → Repository → Drizzle → SQL → PostgreSQL (Neon)
```

Cada capa tiene una responsabilidad clara y aislada:

| Capa | Responsabilidad | ¿Qué NO hace? |
|---|---|---|
| **Controller** | Maneja request/response HTTP, valida entrada con Zod. | No contiene lógica de negocio. |
| **Service** | Lógica de negocio y orquestación. | No sabe de HTTP (no ve `req`/`res`). |
| **Repository** | Persistencia pura (CRUD). | No conoce reglas de dominio. |
| **Drizzle ORM** | Traduce TypeScript a SQL tipado. | No decide nada por vos. |
| **PostgreSQL (Neon)** | Almacena los datos. | No sabe de TypeScript. |

---

## 🧰 Stack

- **Node.js** 22 + **TypeScript**
- **pnpm** (gestor de paquetes)
- **Hono** (framework HTTP sobre Web Standards)
- **Zod** + **@hono/zod-validator** (validación de entrada)
- **Drizzle ORM** + **Drizzle Kit** (schema y migraciones)
- **pg** (driver oficial de PostgreSQL para Node)
- **Neon** (PostgreSQL serverless, plan gratuito)
- **tsx** (ejecución directa de TypeScript)
- **dotenv** (variables de entorno)
- **Docker** + **Render** (empaquetado y despliegue)

---

## 🗂️ Estructura

```
medabots-repository/
├── drizzle/                          # Migraciones SQL generadas por Drizzle Kit
├── src/
│   ├── controllers/
│   │   └── medabot.controller.ts     # Rutas HTTP + validación Zod
│   ├── services/
│   │   └── medabot.service.ts        # Lógica de negocio
│   ├── db/
│   │   ├── index.ts                  # Pool de conexión + instancia Drizzle
│   │   ├── schema.ts                 # Definición tipada de la tabla `medabots`
│   │   └── seed.ts                   # Carga inicial de datos de ejemplo
│   ├── repositories/
│   │   └── medabot.repository.ts     # CRUD encapsulado
│   ├── api.ts                        # Entry point del servidor Hono
│   └── main.ts                       # Laboratorio de persistencia
├── .dockerignore
├── .env.example                      # Plantilla de variables de entorno
├── .gitignore
├── Dockerfile                        # Imagen de producción
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

## 🚀 Setup local

### 1. Requisitos

- Node.js 20+
- pnpm
- Una cuenta en [Neon](https://neon.tech) (o cualquier PostgreSQL accesible)

### 2. Instalación

```bash
git clone https://github.com/JuanAlbertMaizares/medabots-drizzle-labo.git
cd medabots-drizzle-labo
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

### 6. Ejecutar

**La API:**

```bash
pnpm dev:api
```

**El laboratorio de persistencia:**

```bash
pnpm dev:lab
```

---

## 📜 Scripts disponibles

| Script | Descripción |
|---|---|
| `pnpm dev:api` | Levanta la API en modo desarrollo |
| `pnpm start:api` | Levanta la API una sola vez |
| `pnpm dev:lab` | Ejecuta el laboratorio de persistencia |
| `pnpm start:lab` | Ejecuta el laboratorio una sola vez |
| `pnpm typecheck` | Verifica tipos sin emitir archivos |
| `pnpm build` | Compila el servidor a `dist/` |
| `pnpm db:generate` | Genera una migración desde el schema |
| `pnpm db:migrate` | Aplica migraciones pendientes |
| `pnpm db:push` | Empuja el schema directo (sin migración) |
| `pnpm db:studio` | Abre Drizzle Studio (UI web) |
| `pnpm db:seed` | Carga datos de ejemplo |

---

## 🌐 API HTTP

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Health check (usado por Render) |
| `GET` | `/api/medabots` | Lista todos los Medabots |
| `GET` | `/api/medabots/:id` | Obtiene uno por ID (404 si no existe) |
| `POST` | `/api/medabots` | Crea uno nuevo (201 Created) |
| `PUT` | `/api/medabots/:id` | Actualiza parcialmente (404 si no existe) |
| `DELETE` | `/api/medabots/:id` | Elimina (204 No Content, 404 si no existe) |

### Ejemplos con `curl`

```bash
# Health check
curl https://medabots-api-latest.onrender.com/health

# Listar todos
curl https://medabots-api-latest.onrender.com/api/medabots

# Crear uno
curl -X POST https://medabots-api-latest.onrender.com/api/medabots \
  -H "Content-Type: application/json" \
  -d '{"name":"Metal Beetle","medaforce":"Beam","type":"Escarabajo","head":"Beam","leftArm":"Missile","rightArm":"Missile","legs":"Tank"}'

# Obtener por ID
curl https://medabots-api-latest.onrender.com/api/medabots/1

# Actualizar parcialmente
curl -X PUT https://medabots-api-latest.onrender.com/api/medabots/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Metal Beetle MK-II"}'

# Eliminar
curl -X DELETE https://medabots-api-latest.onrender.com/api/medabots/1
```

### Validación con Zod

Todos los endpoints que reciben body (`POST`, `PUT`) validan la entrada contra un esquema Zod. Si el body no cumple, Hono devuelve `400 Bad Request` automáticamente vía `@hono/zod-validator`, antes de que el Service o la DB lo vean.

**Ejemplo de body válido:**

```json
{
  "name": "Metal Beetle",
  "medaforce": "Medaforce (Medalla Rara)",
  "type": "Escarabajo",
  "head": "Beam",
  "leftArm": "Missile",
  "rightArm": "Missile",
  "legs": "Tank"
}
```

---

## 🐳 Docker

El proyecto incluye un `Dockerfile` de una sola etapa que ejecuta TypeScript directamente con `tsx` dentro del contenedor. Es la forma más directa de llevar el proyecto a producción sin compilación previa.

### Construir la imagen

```bash
docker build -t medabots-api .
```

### Correr localmente

```bash
docker run --env-file .env -p 3000:3000 --name medabots-test medabots-api
```

### Por qué el `.env` no está dentro de la imagen

Las credenciales **nunca** van dentro de la imagen Docker. La imagen contiene el código; las variables de entorno se inyectan **en runtime**:

- **Localmente**: con `docker run --env-file .env`.
- **En Render**: desde el panel de Environment Variables del Web Service.

Este diseño garantiza que:

1. La imagen sea portable entre entornos (dev, staging, prod) sin reconstruirse.
2. Los secretos no queden en el historial de capas de Docker.
3. La imagen pueda publicarse en Docker Hub sin riesgo.

---

## ☁️ Deploy en Render

El proyecto está desplegado en **Render** (plan Free) usando la imagen de Docker Hub.

### Configuración del Web Service

| Campo | Valor |
|---|---|
| **Environment** | Docker |
| **Image URL** | `docker.io/juanalbertmaizares/medabots-api:latest` |
| **Port** | 3000 |
| **Environment Variables** | `DATABASE_URL` (URL pooled de Neon) |

### Consideraciones del plan Free

- El servicio **se duerme después de ~15 minutos de inactividad**.
- La primera petición tras el sueño tarda **~30-60 segundos** (cold start).
- Para portafolio, esto es aceptable; para producción real, se necesitaría un plan pago o un ping periódico.

### Aplicar migraciones en producción

Las migraciones se aplican **desde tu máquina local**, no desde Render:

```bash
pnpm db:migrate
```

Render solo ejecuta el contenedor con el código ya desplegado; no aplica migraciones automáticamente. Neon es la misma base que usás en local, así que las migraciones aplicadas localmente se reflejan en producción al instante.

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

### ¿Por qué Docker con `tsx`?

Este proyecto eligió ejecutar TypeScript directamente con `tsx` en el contenedor (en lugar de compilar a JS) por simplicidad y paridad con el entorno de desarrollo:

- El mismo comando (`node --import tsx src/api.ts`) corre en local y en el contenedor.
- No hay paso de compilación que pueda desincronizarse.
- La imagen es más grande (~450 MB), pero el flujo es más directo.

En un proyecto de producción real, se preferiría compilar a JS (`tsc`) y correr `node dist/api.js` para tener una imagen más liviana y un arranque más rápido.

---

## 🗺️ Hoja de ruta

- [x] **Etapa 0** — Setup del proyecto (pnpm, TS, tsconfig, scripts)
- [x] **Etapa 1** — PostgreSQL en Neon + variables de entorno
- [x] **Etapa 2** — Schema + conexión con Drizzle
- [x] **Etapa 3** — Migraciones + datos de seed
- [x] **Etapa 4** — `MedabotRepository` con CRUD completo
- [x] **Etapa 5** — `main.ts` como laboratorio de persistencia
- [x] **Etapa 6** — API HTTP con Hono + Controller + Service
- [x] **Etapa 7** — Docker + Render (deploy en producción)

### Próximos pasos posibles

- [ ] Tests unitarios e integración con Vitest
- [ ] CI/CD con GitHub Actions
- [ ] Manejo centralizado de errores (middleware Hono)
- [ ] CORS configurado
- [ ] Paginación en `findAll`
- [ ] Logging estructurado (pino)
- [ ] Relaciones entre entidades (Medafighter dueño del Medabot)

---

## 📚 Referencias

- [Drizzle ORM](https://orm.drizzle.team/)
- [Hono](https://hono.dev/)
- [Neon](https://neon.tech/docs)
- [pg (node-postgres)](https://node-postgres.com/)
- [Repository Pattern (Martin Fowler)](https://martinfowler.com/eaaCatalog/repository.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 📄 Licencia

MIT