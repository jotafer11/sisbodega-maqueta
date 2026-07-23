# SisBodega 

Sistema de bodega para un taller rectificador de culatas. (repuestos de culata) con entradas y salidas de material.

## Stack

    - Web: Javascript con hash router
    - API: NodeJS
    - Base de datos: PostgreSQL
    - ORM:
    - Monorepo:

## Estructura Repo

```

└── apps/
    ├── api/        # NodeJS (REST API)
    └── web/        # Javascript vanilla 

```

## Setup local

### Requisitos

- Node.js

### Instalacion

```

# Instalar dependencias

npm install en la terminal para que Node.js lea el archivo package.json y descargue las librerías necesarias automáticamente.


```

├── apps/
│   ├── api/        # Fastify (REST API)
│   ├── web/        # Next.js (landing + dashboard)
│   └── mobile/     # Expo (iOS + Android)
├── packages/
│   ├── db/         # Drizzle schema + migraciones
│   ├── types/      # Tipos TypeScript compartidos
│   └── config/     # ESLint, tsconfig base


