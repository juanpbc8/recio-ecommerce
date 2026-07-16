# Recio-Ecommerce Monorepo

Proyecto universitario de e-commerce con arquitectura de monorepo. Incluye un frontend en Next.js desplegado en Vercel y una API REST en NestJS con documentacion Swagger, contenedores Docker y despliegue en Render.

---

## Arquitectura del sistema

| Capa | Tecnologia | Proposito |
| :--- | :--- | :--- |
| **Orquestador** | [Turborepo](https://turborepo.dev) | Gestion de builds y tareas entre workspaces. |
| **Frontend** | [Next.js 16](https://nextjs.org) | Tienda online para clientes. Desplegado en Vercel. |
| **Backend** | [NestJS](https://nestjs.com) | API REST modular con Swagger. Desplegado en Render con Docker. |
| **Tipado** | [Prisma](https://www.prisma.io/orm) | Schema y tipos estrictos dentro de `apps/web-store`. |

---

## Estructura del proyecto

```text
recio-ecommerce/
├── apps/
│   ├── api/              # Backend NestJS + Swagger + Docker
│   └── web-store/        # Frontend Next.js + Tailwind + Prisma
├── .github/workflows/    # CI/CD con GitHub Actions
├── docker-compose.yml    # Levantar API localmente con Docker
├── scripts/              # Scripts de automatizacion de tareas y PRs
├── turbo.json            # Pipeline de tareas de Turborepo
└── package.json          # Workspaces de npm
```

---

## Prerrequisitos

- Node.js 20+
- npm 10+
- Docker y Docker Compose (opcional, para backend)
- Cuenta en GitHub CLI (`gh`) configurada para scripts opcionales

---

## Instalacion

Desde la raiz del proyecto:

```bash
npm install
```

> Nota: este proyecto usa workspaces de npm. Las dependencias se instalan desde la raiz.

---

## Desarrollo local

### Frontend

```bash
cd apps/web-store
npm run dev
```

La tienda estara disponible en `http://localhost:3000`.

### Backend

```bash
cd apps/api
npm run dev
```

La API estara disponible en `http://localhost:3001/api`.

La documentacion Swagger estara en `http://localhost:3001/api/docs`.

### Backend con Docker

```bash
docker-compose up --build
```

La API estara disponible en `http://localhost:4000/api`.

---

## Modulos del API

| Modulo | Descripcion | Endpoints |
| :--- | :--- | :--- |
| **Health** | Estado del servicio | `GET /api/health` |
| **Auth** | Autenticacion JWT mock | `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/profile` |
| **Products** | CRUD de productos | `GET/POST/PATCH/DELETE /api/v1/products` |
| **Categories** | CRUD de categorias | `GET/POST/PATCH/DELETE /api/v1/categories` |
| **Users** | CRUD de usuarios | `GET/POST/PATCH/DELETE /api/v1/users` |
| **Orders** | CRUD de ordenes | `GET/POST/PATCH/DELETE /api/v1/orders` |

> Los datos del backend son mock en memoria. No requiere base de datos.

---

## Despliegue

### Frontend en Vercel

Conecta el repositorio a Vercel y configura el directorio raiz como `apps/web-store`. El despliegue es automatico con cada push a `main`.

### Backend en Render

1. Crea un nuevo **Web Service** en Render.
2. Conecta tu repositorio de GitHub.
3. Selecciona **Docker** como entorno de ejecucion.
4. Configura:
   - **Dockerfile Path**: `apps/api/Dockerfile`
   - **Root Directory**: (dejar por defecto)
   - **Port**: `4000`
5. Agrega variables de entorno:
   - `PORT=4000`
   - `JWT_SECRET=tu-clave-secreta`
6. Render construira y desplegara la API automaticamente.

La URL de la API se vera asi: `https://tu-servicio.onrender.com/api`.

La documentacion Swagger estara en: `https://tu-servicio.onrender.com/api/docs`.

---

## Flujo de trabajo GitHub

El proyecto utiliza un flujo de trabajo ligero basado en issues, ramas y pull requests:

1. Se crea un issue en el milestone **Avance Final**.
2. Se crea una rama `tipo/issue-XX-descripcion` desde `develop`.
3. Se desarrolla el cambio con commits bajo Conventional Commits.
4. Se abre un Pull Request hacia `develop`.
5. Se activa auto-merge; el PR se fusiona al pasar el CI/CD.

Scripts de automatizacion disponibles en `scripts/`:

```bash
./scripts/create-task.sh "feat" "titulo" "descripcion"
./scripts/submit-pr.sh "feat(modulo): descripcion" "cuerpo del PR"
```

---

## CI/CD

- `.github/workflows/ci-cd.yml`: valida el build del frontend.
- `.github/workflows/ci-api.yml`: valida el build de Docker del backend.

Ambos workflows se ejecutan en cada pull request hacia `main` o `develop`.

---

## Capturas recomendadas para la entrega

- Issues y milestone en GitHub.
- Pull requests con auto-merge y checks de CI/CD.
- Swagger UI funcionando localmente.
- Docker Desktop con el contenedor `recio-api` en ejecucion.
- Render dashboard mostrando el servicio desplegado.
- Vercel dashboard mostrando el frontend desplegado.
- Diagrama de arquitectura: Vercel <-> Render <-> Docker Container.

---

## Licencia

Proyecto academico. Uso educativo.
