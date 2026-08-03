# SMCPP Backend — API REST

Backend del Sistema de Manejo de Prácticas Preprofesionales (SMCPP) desarrollado con Node.js, Express, TypeScript, PostgreSQL y Prisma ORM.

## Requisitos previos

- **Node.js**: v18.x o superior
- **PostgreSQL**: v14.x o superior
- **npm** o **pnpm**

## Configuración e Instalación

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` en la raíz del proyecto backend y configura las credenciales de tu base de datos:

```bash
cp .env.example .env
```

Asegúrate de ajustar `DATABASE_URL`:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/smcpp?schema=public"
JWT_SECRET="clave_secreta_super_segura_de_produccion"
PORT=3001
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Migraciones y Generación de Prisma

Genera el cliente de Prisma y ejecuta las migraciones para crear la base de datos:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Poblar la Base de Datos (Seed)

Ejecuta el script de seed para insertar los datos iniciales (coordinador, estudiante Ana Torres, tutor, empresa, convenio, etc.):

```bash
npm run db:seed
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3001`.

---

## Usuarios de Prueba (Credenciales Seed)

| Rol | Correo | Contraseña |
| --- | --- | --- |
| **Coordinador** | `coordinador@unap.edu.pe` | `Coordinador123*` |
| **Estudiante** | `ana.torres@unap.edu.pe` | `Estudiante123*` |
| **Tutor** | `carlos.medina@andestech.pe` | `Tutor123*` |

---

## Ejemplo de Login (Autenticación)

### Solicitud:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "coordinador@unap.edu.pe",
  "password": "Coordinador123*"
}
```

### Respuesta Exitosa (200 OK):
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clxyz...",
      "nombre": "Coord. Carlos Ramos",
      "email": "coordinador@unap.edu.pe",
      "rol": "COORDINADOR",
      "estudiante": null,
      "tutor": null
    }
  }
}
```

---

## Endpoints Disponibles

### Health Check
- `GET /api/health` — Verificación de estado del servidor

### Autenticación (`/api/auth`)
- `POST /api/auth/login` — Inicio de sesión y generación de JWT
- `GET /api/auth/me` — Datos del usuario autenticado (requiere JWT)

### Empresas (`/api/empresas`)
- `GET /api/empresas` — Lista de empresas (Estudiantes ven solo activas, Coordinadores ven todas)
- `GET /api/empresas/:id` — Detalle de una empresa
- `POST /api/empresas` — Crear nueva empresa (Solo Coordinador/Admin)
- `PUT /api/empresas/:id` — Actualizar empresa (Solo Coordinador/Admin)

### Convenios (`/api/convenios`)
- `GET /api/convenios` — Lista de convenios activos
- `POST /api/convenios` — Crear nuevo convenio (Solo Coordinador/Admin)
- `PUT /api/convenios/:id` — Actualizar convenio (Solo Coordinador/Admin)
- `PATCH /api/convenios/:id/estado` — Cambiar estado del convenio (Solo Coordinador/Admin)

### Postulaciones (`/api/postulaciones`)
- `GET /api/postulaciones` — Lista de postulaciones (Filtrada por rol)
- `GET /api/postulaciones/:id` — Detalle de una postulación
- `POST /api/postulaciones` — Crear postulación (Estudiantes o Coordinador)
- `PATCH /api/postulaciones/:id/estado` — Cambiar estado de la postulación (Solo Coordinador/Admin)
- `POST /api/postulaciones/:id/observaciones` — Registrar observaciones (Solo Coordinador/Admin)

### Notificaciones (`/api/notificaciones`)
- `GET /api/notificaciones` — Lista de notificaciones del usuario autenticado
- `PATCH /api/notificaciones/:id/leida` — Marcar notificación como leída
