# 🚀 Recio-Ecommerce Monorepo

¡Bienvenidos al proyecto! Esta es una arquitectura multimódulo. El objetivo es centralizar la lógica de negocio y la persistencia de datos, permitiendo que diferentes tecnologías coexistan en armonía, compartiendo tipos y reglas de negocio.

---

## 🏗️ Arquitectura del sistema

| Capa                    | Tecnología                                       | Proposito                                                                |
| :---------------------- | :----------------------------------------------- | :----------------------------------------------------------------------- |
| **Orquestador**         | [Turborepo](https://turborepo.dev)               | Gestión de builds, pipeline y caché inteligente.                         |
| **API / Backend**       | [NestJS](https://nestjs.com)                     | Arquitectura modular (estilo Spring Boot) con inyección de dependencias. |
| **Ecommerce (Público)** | [NextJS](https://nextjs.org)                     | Renderizado híbrido (SSR/SSG) para optimización de SEO y performance.    |
| **ORM / DB**            | [Prisma](https://www.prisma.io/orm) + PostgreSQL | Single Source of Truth para los tipos de datos en todo el repo.          |

---

## 🛠 Estructura del proyecto

```text
recio-ecommerce/
├── apps/
│   ├── api/           # Backend: NestJS Core (Puerto 3001)
│   ├── web-store/     # Frontend: Next.js App para clientes (Puerto 3000)
├── packages/
│   ├── database/      # Prisma Schema & Shared Client
├── .prettierrc        # Reglas estéticas globales
├── turbo.json         # Configuración del pipeline de ejecución
└── package.json       # Manager central de Workspaces
```

---

## Guía de Inicio Rápido

### 1. Prerrequisitos

- Node.js v20+ (Se recomienda usar nvm use 20).
- NPM v10+.
- Instancia de PostgreSQL.

### 2. Instalación y Configuración

Clona el proyecto y desde la raíz ejecuta:

```bash
npm install
```

Configura tu base de datos en packages/database/.env:

```bash
DATABASE_URL="tu_url_de_postgresql"
```

### 3. Modo Desarrollo

Levanta todo el ecosistema (API + Web) con un solo comando:

```Bash
npm run dev
```

---

## 🔄 ¿Por qué tantos package.json?

Cada aplicación es un "Workspace". Esto permite que:

Cada equipo trabaje en su tecnología sin pisar las dependencias del otro.

Podamos compartir código (como las interfaces de la base de datos) de forma instantánea entre el backend y los frontends.

Turborepo optimice las compilaciones usando caché, para no perder tiempo en builds innecesarios.
