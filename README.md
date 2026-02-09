# Roia — Gestión Textil

Sistema de gestión de producción, clientes y finanzas para Roia.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Prisma 7** (PostgreSQL adapter)
- **Supabase** (Auth, Storage, Database)
- **Shadcn/UI** + Tailwind CSS 4
- **TypeScript 5**

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# → Completar con las credenciales de Supabase

# 3. Correr migraciones
npm run db:migrate

# 4. Seed de datos iniciales (estados de producción)
npm run db:seed

# 5. Crear usuario admin
npm run db:seed-admin

# 6. Iniciar dev server
npm run dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta (service role) |
| `DATABASE_URL` | Connection string de PostgreSQL |

## Deploy en Vercel

1. Subí el repo a GitHub
2. Importá en [vercel.com/new](https://vercel.com/new)
3. Agregá las 4 variables de entorno
4. Vercel detecta Next.js automáticamente y buildea

## Roles

- **Admin**: acceso completo (dashboard, clientes, artículos, órdenes, compras, gastos, finanzas, equipo)
- **Empleado**: solo órdenes
