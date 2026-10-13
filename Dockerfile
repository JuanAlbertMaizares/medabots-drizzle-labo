FROM node:22-alpine

WORKDIR /app

# Activar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar manifiestos
COPY package.json pnpm-lock.yaml ./

# Instalar TODAS las dependencias (necesitamos tsx en runtime)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copiar el código fuente completo
COPY tsconfig.json drizzle.config.ts ./
COPY src ./src

# Variables por defecto (Render las sobreescribe)
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME_BIND=0.0.0.0

EXPOSE 3000

# Ejecutar directamente con tsx (mismo comando que en local)
CMD ["node", "--import", "tsx", "src/api.ts"]