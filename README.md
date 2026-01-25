# Frontend - Taller Donky

Frontend del sistema de gestión de turnos del taller Donky.

## Tecnologías

- React 19
- Vite
- React Router DOM
- Axios

## Instalación

```bash
npm install
```

## Configuración

Copia el archivo `.env.example` a `.env` y configura la URL de la API:

```bash
cp .env.example .env
```

Edita `.env` y configura:
```
VITE_API_URL=http://localhost:3000/api
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
  ├── components/       # Componentes reutilizables
  │   └── Layout/       # Componentes de layout
  ├── context/          # Contextos de React
  ├── pages/            # Páginas principales
  ├── services/         # Servicios API
  └── App.jsx           # Componente principal
```

## Funcionalidades

- ✅ Autenticación (Login)
- ✅ Dashboard con métricas
- ✅ Gestión de Clientes
- ✅ Gestión de Vehículos
- ✅ Gestión de Turnos
- ✅ Configuración del Taller
