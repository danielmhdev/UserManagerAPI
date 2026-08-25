# UserManager API 🚀

API RESTful profesional construida con **Node.js**, **Express**, **TypeScript**, **PostgreSQL** y **Prisma ORM**, implementando autenticación mediante **JSON Web Tokens (JWT)**, cifrado seguro con **Bcrypt** y control de acceso basado en roles (**RBAC**).

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Variables de Entorno](#-variables-de-entorno)
- [Base de Datos y Modelado](#-base-de-datos-y-modelado)
- [Referencia de la API (Endpoints)](#-referencia-de-la-api-endpoints)
- [Seguridad y Control de Acceso (RBAC)](#-seguridad-y-control-de-acceso-rbac)
- [Manejo Centralizado de Errores](#-manejo-centralizado-de-errores)
- [Documentación del Reto (Día a Día)](#-documentación-del-reto-día-a-día)
- [Agradecimientos](#-agradecimientos)

---

## 📖 Descripción del Proyecto

**UserManager API** es el resultado de un reto de desarrollo backend guiado a lo largo de 40 días. El proyecto evoluciona desde los conceptos fundamentales de servidores HTTP y estructuras en memoria hasta una arquitectura modular por capas desacopladas, preparada para producción y conectada con bases de datos relacionales y clientes frontend.

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (TypeScript)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM & Migraciones:** [Prisma ORM v7](https://www.prisma.io/)
- **Contenedores:** [Docker](https://www.docker.com/) & Docker Compose
- **Seguridad & Auth:** [JWT (jsonwebtoken)](https://jwt.io/), [Bcrypt](https://www.npmjs.com/package/bcrypt)
- **Herramientas de Desarrollo:** Prisma Studio, Adminer, tsx

---

## 🏗️ Arquitectura del Proyecto

El backend implementa una **arquitectura por capas** bajo el principio de responsabilidad única (SRP):

```text
HTTP Request ──► Routes ──► Middlewares (Auth / RBAC) ──► Controllers ──► Services ──► Repositories ──► Prisma ORM ──► PostgreSQL
```

### Estructura de Directorios

```text
src/
├── controllers/          # Controladores HTTP (manejo de req, res y códigos de estado)
│   ├── auth.controller.ts
│   ├── health.controller.ts
│   └── user.controller.ts
├── errors/               # Clases y manejo personalizado de excepciones
│   └── AppError.ts
├── middlewares/          # Interceptores de autenticación, roles y errores
│   ├── auth.middleware.ts
│   └── role.middleware.ts
├── repositories/         # Abstracción del acceso a datos con Prisma
│   └── user.repository.ts
├── routes/               # Definición y enrutamiento modular de endpoints
│   ├── auth.routes.ts
│   ├── health.routes.ts
│   └── user.routes.ts
├── services/             # Lógica de negocio, reglas y validaciones
│   ├── auth.service.ts
│   └── user.service.ts
├── types/                # Definiciones e interfaces de TypeScript
│   ├── auth.types.ts
├── utils/                # Utilidades auxiliares (JWT, Bcrypt, parseo, sanitización)
│   ├── jwt.utils.ts
│   ├── parse.utils.ts
│   ├── password.utils.ts
│   └── string.utils.ts
├── debug-password
├── prisma.ts             # Instancia singleton del cliente de Prisma
└── server.ts             # Punto de entrada de la aplicación Express
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

- Node.js (versión 18+ recomendada)
- Docker y Docker Compose
- Gestor de paquetes npm

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/danielmhdev/usermanagerapi.git
cd usermanagerapi
npm install
```

### 2. Configurar las variables de entorno

Copia la plantilla de entorno y ajusta las variables según sea necesario:

```bash
cp .env.example .env
```

### 3. Levantar la base de datos con Docker

Inicia el contenedor de PostgreSQL y la interfaz de Adminer:

```bash
docker compose up -d
```

> **Adminer (Gestor Web):** Disponible en [http://localhost:8080](http://localhost:8080)  
> _Sistema:_ PostgreSQL | _Servidor:_ postgres | _Usuario:_ usermanager | _Base de datos:_ usermanager_db

### 4. Ejecutar migraciones y poblar datos iniciales (Seed)

```bash
# Aplicar migraciones a la base de datos
npx prisma migrate dev

# Cargar los datos de prueba
npm run prisma:seed
```

### 5. Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

La API estará disponible en: `http://localhost:3000`

---

## 🔐 Variables de Entorno

Configuración requerida en el archivo `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://usermanager:usermanager_password@localhost:5432/usermanager_db?schema=public"
JWT_SECRET="clave_secreta_super_segura_para_firmar_tokens"
JWT_EXPIRES_IN="1h"
```

> ⚠️ **Nota de Seguridad:** `JWT_SECRET` debe cambiarse en cada entorno y nunca debe compartirse ni subirse a repositorios públicos.

---

## 🗄️ Base de Datos y Modelado

El modelo `User` en Prisma define las reglas de integridad del sistema:

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(USER)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Usuarios Iniciales de Prueba (Seed)

| Email                | Contraseña    | Rol     | Estado   | Propósito de Prueba                    |
| :------------------- | :------------ | :------ | :------- | :------------------------------------- |
| `admin@email.com`    | `admin123`    | `ADMIN` | Activo   | CRUD global, administración            |
| `user@email.com`     | `user123`     | `USER`  | Activo   | Autoservicio (`/me`), restricción RBAC |
| `inactive@email.com` | `inactive123` | `USER`  | Inactivo | Validación de bloqueo de login         |

---

## 📡 Referencia de la API (Endpoints)

### 1. Estado del Servidor

| Método | Endpoint      | Acceso  | Descripción                                    |
| :----- | :------------ | :------ | :--------------------------------------------- |
| `GET`  | `/api/health` | Público | Comprobación de salud y operatividad de la API |
| `GET`  | `/api/ping`   | Público | Test simple de conectividad (`pong`)           |

---

### 2. Autenticación (`/api/auth`)

| Método | Endpoint             | Acceso      | Descripción                                          |
| :----- | :------------------- | :---------- | :--------------------------------------------------- |
| `POST` | `/api/auth/register` | Público     | Registro de nuevos usuarios con rol `USER`           |
| `POST` | `/api/auth/login`    | Público     | Autenticación de credenciales y emisión de token JWT |
| `GET`  | `/api/auth/me`       | Autenticado | Obtiene los datos del usuario autenticado actual     |

#### Ejemplo de Login (`POST /api/auth/login`)

**Body:**

```json
{
  "email": "user@email.com",
  "password": "user123"
}
```

**Respuesta Exitosa (`200 OK`):**

```json
{
  "message": "Login correcto",
  "data": {
    "user": {
      "id": 2,
      "name": "Usuario Demo",
      "email": "user@email.com",
      "role": "USER",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Gestión de Usuarios (`/api/users`)

Todas las rutas protegidas requieren la cabecera:  
`Authorization: Bearer <token_jwt>`

| Método   | Endpoint         | Acceso                  | Descripción                                       |
| :------- | :--------------- | :---------------------- | :------------------------------------------------ |
| `GET`    | `/api/users/me`  | Autenticado             | Consulta el perfil del usuario autenticado        |
| `PATCH`  | `/api/users/me`  | Autenticado             | Actualiza los datos propios o contraseña          |
| `GET`    | `/api/users`     | **Solo ADMIN**          | Lista todos los usuarios registrados              |
| `GET`    | `/api/users/:id` | **ADMIN o Propietario** | Consulta el detalle de un usuario por ID          |
| `POST`   | `/api/users`     | **Solo ADMIN**          | Creación manual/administrativa de usuarios        |
| `PATCH`  | `/api/users/:id` | **Solo ADMIN**          | Modificación de roles, estado o datos de terceros |
| `DELETE` | `/api/users/:id` | **Solo ADMIN**          | Baja lógica de usuario (`isActive = false`)       |

---

## 🔒 Seguridad y Control de Acceso (RBAC)

1. **Protección de Contraseñas:** Cifrado unidireccional con algoritmo `bcrypt`. La API **nunca** almacena contraseñas en texto plano ni retorna `passwordHash` en ninguna respuesta pública.
2. **Prevención de Enumeración de Cuentas:** Ante credenciales incorrectas o cuentas inexistentes, la API responde con un genérico `401 Unauthorized` (_"Credenciales inválidas"_).
3. **Control de Acceso basado en Roles (RBAC):**
   - **`401 Unauthorized`:** Token ausente, firma inválida o sesión expirada.
   - **`403 Forbidden`:** Usuario autenticado intentando acceder a una acción reservada para administradores.
4. **Baja Lógica (_Soft Delete_):** La eliminación de usuarios preserva la integridad de los datos históricos estableciendo `isActive: false`.

---

## ⚠️ Manejo Centralizado de Errores

La API utiliza un middleware global de captura de excepciones que unifica las respuestas de error:

```json
{
  "error": "Mensaje descriptivo del error",
  "statusCode": 400,
  "path": "/api/users/abc",
  "method": "GET",
  "timestamp": "2026-08-25T18:00:00.000Z"
}
```

### Principales Códigos HTTP Utilizados

| Código                   | Significado       | Escenario de Uso                                         |
| :----------------------- | :---------------- | :------------------------------------------------------- |
| **`200 OK`**             | Éxito             | Consultas, actualizaciones y bajas exitosas              |
| **`201 Created`**        | Creado            | Registro y creación de usuarios                          |
| **`400 Bad Request`**    | Petición Inválida | Errores de validación, tipos de datos o campos faltantes |
| **`401 Unauthorized`**   | No Autenticado    | Falta de token, firma inválida o login incorrecto        |
| **`403 Forbidden`**      | Prohibido         | Permisos insuficientes (ej. `USER` en ruta de `ADMIN`)   |
| **`404 Not Found`**      | No Encontrado     | Usuario inexistente o ruta no mapeada                    |
| **`409 Conflict`**       | Conflicto         | Intento de registrar un email ya existente               |
| **`500 Internal Error`** | Error de Servidor | Excepciones no controladas                               |

---

## 📚 Documentación del Reto (Día a Día)

| Fase | Temas Tratados / Enlaces |
| :--- | :--- |
| **Fase 1: Fundamentos HTTP & Express** | • [Día 01 - Diseño inicial](docs/dia-01-diseno-inicial-usermanager.md)<br>• [Día 02 - Preparación del Proyecto](docs/dia-02-preparacion-proyecto.md)<br>• [Día 03 - Primer Endpoint](docs/dia-03-primer-endpoint.md)<br>• [Día 04 - Métodos HTTP](docs/dia-04-metodos-http.md)<br>• [Día 05 - JSON, body, params y headers](docs/dia-05-json-body-params-headers.md)<br>• [Día 06 - Cliente HTTP y depuración](docs/dia-06-cliente-http-depuracion.md) |
| **Fase 2: Prototipado y CRUD en Memoria** | • [Día 07 - Listado de usuarios en memoria](docs/dia-07-listado-usuarios.md)<br>• [Día 08 - Consultar usuario por ID](docs/dia-08-consultar-usuario-id.md)<br>• [Día 09 - Crear usuarios en memoria](docs/dia-09-crear-usuarios.md)<br>• [Día 10 - Actualizar usuarios en memoria](docs/dia-10-actualizar-usuarios.md)<br>• [Día 11 - Eliminar o desactivar usuarios en memoria](docs/dia-11-eliminar-desactivar-usuarios.md) |
| **Fase 3: Validaciones, Respuestas y Manejo de Errores** | • [Día 12 - Validación manual básica](docs/dia-12-validacion-manual-basica.md)<br>• [Día 13 - Validación de email y duplicados](docs/dia-13-validacion-email-duplicados.md)<br>• [Día 14 - Códigos de estado HTTP](docs/dia-14-codigos-estado-http.md)<br>• [Día 15 - Middleware centralizado de errores](docs/dia-15-middleware-errores.md) |
| **Fase 4: Persistencia con Docker, PostgreSQL & Prisma** | • [Día 16 - Base de datos y persistencia](docs/dia-16-base-datos-persistencia.md)<br>• [Día 17 - PostgreSQL con Docker Compose](docs/dia-17-postgresql-docker-compose.md)<br>• [Día 18 - Diseño del modelo persistente User](docs/dia-18-diseno-modelo-persistente-user.md)<br>• [Día 19 - ORM o acceso a datos](docs/dia-19-orm-acceso-datos.md)<br>• [Día 20 - Instalación y configuración inicial de Prisma](docs/dia-20-instalacion-prisma.md)<br>• [Día 21 - Modelo Prisma User](docs/dia-21-modelo-prisma-user.md)<br>• [Día 22 - Primera migración con Prisma](docs/dia-22-primera-migracion-prisma.md)<br>• [Día 23 - Prisma Studio](docs/dia-23-prisma-studio.md)<br>• [Día 24 - Seed de datos iniciales](docs/dia-24-seed-datos-iniciales.md)<br>• [Día 25 - Consultas básicas con Prisma Client](docs/dia-25-consultas-basicas-prisma.md) |
| **Fase 5: Arquitectura en Capas & Refactorización** | • [Día 26 - Separar rutas](docs/dia-26-separar-rutas.md)<br>• [Día 27 - Controladores](docs/dia-27-controladores.md)<br>• [Día 28 - Servicios](docs/dia-28-servicios.md)<br>• [Día 29 - Repositorio con Prisma](docs/dia-29-repositorio-prisma.md)<br>• [Día 30 - CRUD persistente ordenado](docs/dia-30-crud-persistente-ordenado.md)<br>• [Día 31 - Limpieza y refactor](docs/dia-31-limpieza-refactor.md) |
| **Fase 6: Seguridad, Autenticación (JWT) & Roles (RBAC)** | • [Día 32 - Contraseñas seguras con bcrypt](docs/dia-32-bcrypt-passwords.md)<br>• [Día 33 - Registro de usuarios](docs/dia-33-auth-register.md)<br>• [Día 34 - Login de usuarios](docs/dia-34-auth-login.md)<br>• [Día 35 - Generación de token JWT](docs/dia-35-jwt.md)<br>• [Día 36 - Middleware de autenticación](docs/dia-36-auth-middleware.md)<br>• [Día 37 - Roles y permisos](docs/dia-37-roles-permisos.md) |
| **Fase 7: Integración con Frontend & Cierre** | • [Día 38 - Frontend: conexión con la API](docs/dia-38-frontend-conexion-api.md)<br>• [Día 39 - Pruebas de integración con frontend](docs/dia-39-pruebas-integracion-frontend.md)<br>• [Día 40 - Revisión final y cierre](docs/dia-40-revision-final-cierre.md) |
---

## 🤝 Agradecimientos

Quiero expresar mi sincero agradecimiento a mi profesor de DAM, [Jordi Cidoncha](https://www.linkedin.com/in/jordicido/), por la dedicación y el enorme esfuerzo invertidos durante este verano en diseñar este reto día a día.

Esta iniciativa ha supuesto un punto de inflexión en mi formación como desarrollador junior, permitiéndome evolucionar desde una estructura básica en memoria hasta construir una API RESTful robusta, segura y lista para producción.
