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
├── drizzle/                     # Migraciones SQL generadas por Drizzle Kit
├── src/
│   ├── db/
│   │   ├── index.ts             # Pool de conexión + instancia Drizzle
│   │   ├── schema.ts            # Definición tipada de la tabla `medabots`
│   │   └── seed.ts              # Carga inicial de datos de ejemplo
│   ├── repositories/
│   │   └── medabot.repository.ts # CRUD encapsulado
│   └── main.ts                  # Laboratorio de pruebas
├── .env.example                 # Plantilla de variables de entorno
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
| `pnpm start` | Ejecuta el laboratorio (`main.ts`) una sola vez |
| `pnpm dev` | Ejecuta `main.ts` en modo watch |
| `pnpm typecheck` | Verifica tipos sin emitir archivos |
| `pnpm db:generate` | Genera un archivo de migración desde el schema |
| `pnpm db:migrate` | Aplica migraciones pendientes a la base |
| `pnpm db:push` | Empuja el schema directo (sin migración) |
| `pnpm db:studio` | Abre Drizzle Studio (UI web para ver/editar datos) |
| `pnpm db:seed` | Carga datos de ejemplo |

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