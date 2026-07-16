# Etapa de compilacion
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias del monorepo y del workspace api
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Instalar dependencias del workspace api unicamente
RUN npm ci --workspace=api

# Copiar codigo fuente del api
COPY apps/api ./apps/api
COPY turbo.json ./

# Compilar solo la aplicacion NestJS
RUN npm run build --workspace=api

# Etapa de produccion
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copiar archivos de dependencias
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Instalar solo dependencias de produccion del api
RUN npm ci --workspace=api --only=production

# Copiar compilacion desde la etapa anterior
COPY --from=builder /app/apps/api/dist ./dist

# Exponer puerto
EXPOSE 4000

# Comando de inicio
CMD ["node", "dist/main"]
