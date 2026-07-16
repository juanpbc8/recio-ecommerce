# --- Etapa de Compilación (Build) ---
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Compilar la aplicación de NestJS a código de producción (dist/)
RUN npm run build

# --- Etapa de Producción (Runner) ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar solo lo necesario para ahorrar espacio (Contenedor ligero)
COPY package*.json ./
RUN npm install --only=production

# Copiar la compilación desde el builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto por donde escucha NestJS (por defecto 3000 o 4000)
EXPOSE 4000

# Comando para arrancar el backend en el contenedor
CMD ["node", "dist/main"]