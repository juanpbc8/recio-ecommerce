# Etapa de compilacion
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar codigo fuente y configuracion
COPY . .

# Compilar la aplicacion NestJS
RUN npm run build

# Etapa de produccion
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copiar dependencias de produccion
COPY package*.json ./
RUN npm ci --only=production

# Copiar compilacion desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 4000

# Comando de inicio
CMD ["node", "dist/main"]
