# Surveys App

Repositorio para la aplicación de encuestas (fullstack):
- `backend/`: API con TypeScript, Express y Prisma.
- `frontend/`: app móvil con Expo/React Native.

## Estructura

- backend/
  - src/index.ts: servidor principal.
  - src/controllers: rutas y controladores.
  - src/models: definiciones de modelos.
  - prisma/: schema, migraciones y DB.
  - package.json: dependencias y scripts.

- frontend/
  - app.json + package.json
  - src/App.tsx: punto de entrada.
  - src/screens/: pantallas de la app.
  - src/services/api.ts: cliente HTTP.

## Requisitos

- Node.js 18+ (recomendado)
- npm o yarn
- SQLite (opcional, Prisma usa SQLite por defecto)

## Instalación

### Backend

```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Uso

1. Iniciar backend (en `http://localhost:3000` por defecto).
2. Iniciar frontend (Expo).
3. Consumir APIs desde la app.

## Configuración

- Backend: copia `.env.example` (si existe) a `.env` y ajusta `DATABASE_URL`.
- Frontend: revisa `src/services/api.ts` para la URL del backend.

## Contribución

1. Hacer fork.
2. Crear rama `feature/x`.
3. Hacer PR con descripción clara.

## Licencia

MIT
