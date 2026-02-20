# Backend - Horarios Feria

Backend desarrollado con NestJS, Prisma y PostgreSQL para el sistema de reservas de Global Money Week.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/horarios_feria?schema=public"
JWT_SECRET=tu-secret-key-seguro
JWT_EXPIRES_IN=1h
PORT=3000
```

3. Generar Prisma Client:
```bash
npm run prisma:generate
```

4. Ejecutar migraciones:
```bash
npm run prisma:migrate
```

5. Ejecutar seed (datos iniciales):
```bash
npm run prisma:seed
```

6. Iniciar servidor:
```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

## 📋 Scripts Disponibles

- `npm run build` - Compilar proyecto
- `npm run start` - Iniciar en producción
- `npm run start:dev` - Iniciar en modo desarrollo (watch)
- `npm run start:debug` - Iniciar en modo debug
- `npm run prisma:generate` - Generar Prisma Client
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio
- `npm run prisma:seed` - Ejecutar seed

## 🔐 Credenciales por Defecto

**Usuario Admin:**
- Email: `admin@globalmoneyweek.com`
- Password: `admin123`

⚠️ **IMPORTANTE:** Cambiar estas credenciales en producción.

## 📡 Endpoints Disponibles

### Públicos
- `GET /api/events/days` - Obtener días y horarios con cupos
- `GET /api/amie/:code` - Consultar institución por código AMIE

### Autenticación
- `POST /auth/login` - Login de administrador

## 🏗️ Estructura del Proyecto

```
src/
├── auth/           # Módulo de autenticación
├── events/         # Módulo de eventos
├── amie/           # Módulo de consulta AMIE
├── prisma/         # Prisma Service
└── common/         # Utilidades compartidas
```

## 🗄️ Base de Datos

El proyecto usa Prisma como ORM. Los modelos están definidos en `prisma/schema.prisma`.

### Modelos Principales:
- `User` - Usuarios administradores
- `Event` - Eventos (días de la feria)
- `TimeSlot` - Horarios disponibles
- `Reservation` - Reservas de instituciones

## 🔧 Tecnologías

- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de DTOs
