# Día 20 - Instalación y configuración inicial de Prisma

## Qué he hecho

- He instalado Prisma CLI.
- He instalado Prisma Client.
- He ejecutado prisma init.
- He creado la carpeta prisma.
- He revisado el archivo schema.prisma.
- He configurado DATABASE_URL.
- He revisado .env y .env.example.
- He comprobado que .env está en .gitignore.
- He validado el esquema de Prisma.
- He generado Prisma Client.

## Comandos usados

```bash
npm install -D prisma
npm install @prisma/client
npx prisma --version
npx prisma init --datasource-provider postgresql
npx prisma validate
npx prisma generate
```

## Archivos generados o modificados

```text
prisma/schema.prisma
.env
.env.example
.gitignore
package.json
package-lock.json
```

## schema.prisma inicial

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## DATABASE_URL

```env
DATABASE_URL="postgresql://usermanager:usermanager_password@localhost:5432/usermanager_db"
```

## Explicación personal

Prisma necesita un archivo schema.prisma para saber qué base de datos usamos y qué modelos tendrá el proyecto. Hoy todavía no hemos definido el modelo User, pero hemos dejado Prisma instalado y preparado para hacerlo en el siguiente día.

## Prisma CLI y Prisma Client

Aunque ambos forman parte del ecosistema de Prisma, cumplen funciones completamente distintas durante el desarrollo de la aplicación:

---

### 1. `prisma` (Prisma CLI)

Es la **herramienta de línea de comandos** (_Command Line Interface_) que utilizas desde la terminal de tu sistema.

- **Función:** Administrar la base de datos, gestionar el esquema y ejecutar herramientas del entorno de Prisma.
- **Uso en terminal:** `npx prisma init`, `npx prisma migrate dev`, `npx prisma studio`, `npx prisma generate`.
- **Momento de uso:** Exclusivamente cuando tú, como desarrollador, ejecutas comandos en la consola. No interviene cuando la API está encendida respondiendo peticiones.

---

### 2. `@prisma/client` (Prisma Client)

Es la **librería de código** que importas e instancias directamente en tus archivos de TypeScript/JavaScript.

- **Función:** Consultar y manipular la base de datos directamente desde el código backend de tu servidor Express.
- **Uso en código:** `const users = await prisma.user.findMany();`
- **Momento de uso:** En tiempo de ejecución (_runtime_), cada vez que tu API recibe una petición HTTP y necesita leer o escribir datos en PostgreSQL.

---

### Resumen de diferencias

| Concepto             | ¿Qué es?                      | ¿Dónde se usa?              | Ejemplo                   |
| -------------------- | ----------------------------- | --------------------------- | ------------------------- |
| **`prisma`**         | Herramienta de comandos (CLI) | En la **terminal**          | `npx prisma studio`       |
| **`@prisma/client`** | Librería / Conector ORM       | En el **código TypeScript** | `prisma.user.create(...)` |

## Partes de schema.prisma

El archivo `prisma/schema.prisma` es el corazón de la configuración de Prisma. En él se define cómo se genera el cliente de consultas, a qué base de datos nos conectamos y cómo se estructuran nuestros modelos.

---

### 1. `generator client`

Bloque que indica a Prisma **qué código o cliente debe autogenerar** cuando ejecutamos `npx prisma generate`.

- Por defecto utiliza el motor `prisma-client-js`, el cual construye la librería `@prisma/client` personalizada con todos los métodos e interfaces de TypeScript adaptados a nuestras tablas.

### 2. `datasource db`

Bloque de configuración de la **fuente de datos** (_Database Connection_). Define los parámetros principales para que Prisma sepa a qué base de datos física debe conectarse y qué tipo de servidor relacional es.

### 3. `provider`

Propiedad clave que especifica el **motor o tipo de base de datos** que estamos utilizando.

- _Ejemplos:_ `"postgresql"`, `"mysql"`, `"sqlite"`, `"sqlserver"`. En nuestro proyecto utilizamos `"postgresql"`.

### 4. `url`

Propiedad que define la **cadena de conexión** (_Connection String_) a la base de datos. Contiene los datos necesarios para autenticarse: usuario, contraseña, host, puerto y nombre de la base de datos.

### 5. `env("DATABASE_URL")`

Es una función auxiliar de Prisma que **lee el valor de una variable de entorno** del archivo `.env` en lugar de escribir la ruta de conexión directamente en el código.

- **¿Por qué se usa?** Por seguridad y buenas prácticas. Evita exponer credenciales sensibles (como usuarios y contraseñas) dentro del repositorio Git y permite cambiar de base de datos fácilmente en diferentes entornos (desarrollo, pruebas, producción).

---

### Ejemplo visual en `schema.prisma`

```prisma
// 1. Configuración de la generación del cliente
generator client {
  provider = "prisma-client-js"
}

// 2. Configuración de la fuente de datos
datasource db {
  provider = "postgresql"             // Motor utilizado
  url      = env("DATABASE_URL")     // Lectura segura desde el .env
}
```

---

## Relacionar `.env` con Docker Compose

| Parte             | Valor en Docker Compose | Valor en DATABASE_URL                                                             |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------- |
| **Usuario**       | `POSTGRES_USER`         | El primer parámetro tras el protocolo (`postgresql://usermanager:...`)            |
| **Contraseña**    | `POSTGRES_PASSWORD`     | El valor que va tras los dos puntos del usuario (`...:cusermanager_password@...`) |
| **Base de datos** | `POSTGRES_DB`           | El nombre que se pone al final de la ruta (`...:5432/usermanager_db`)             |
| **Puerto**        | `5432:5432`             | El número de puerto que va tras el host (`...:5432/...`)                          |
| **Host**          | ejecución local         | Se indica como `localhost` o `127.0.0.1` (`...@localhost:5432/...`)               |

---

## Flujo de la arquitectura con Prisma

```mermaid
flowchart LR
    A[schema.prisma] --> B[Prisma Client]
    B --> C[API Express]
    C --> D[PostgreSQL]
```

Este diagrama representa cómo se transforma la definición de los datos en la comunicación real de la aplicación:

1. **`schema.prisma` $\rightarrow$ `Prisma Client`:** Tu archivo de esquema sirve como plantilla para autogenerar la librería **Prisma Client** personalizada con todos sus tipos.
2. **`Prisma Client` $\rightarrow$ `API Express`:** Tu servidor Express importa este cliente generado para poder realizar operaciones sobre la base de datos desde el código TypeScript (`prisma.user.findMany()`).
3. **`API Express` $\rightarrow$ `PostgreSQL`:** Cuando la API recibe una petición HTTP, utiliza el cliente para traducir esas instrucciones en consultas SQL reales y comunicarse con PostgreSQL.

## Preparación para el modelo User

Antes de escribir el código final en `schema.prisma`, definimos la estructura detallada del modelo `User`. Esta tabla especifica los atributos, tipos de datos y restricciones de cada campo para garantizar la integridad de los datos en PostgreSQL:

| Campo          | Tipo conceptual  | Obligatorio | Único | Valor por defecto | Se devuelve al cliente |
| -------------- | ---------------- | ----------- | ----- | ----------------- | ---------------------- |
| `id`           | número           | sí          | sí    | automático        | sí                     |
| `name`         | texto            | sí          | no    | no                | sí                     |
| `email`        | texto            | sí          | sí    | no                | sí                     |
| `passwordHash` | texto            | sí          | no    | no                | no                     |
| `role`         | `USER` / `ADMIN` | sí          | no    | `USER`            | sí                     |
| `isActive`     | booleano         | sí          | no    | `true`            | sí                     |
| `createdAt`    | fecha            | sí          | no    | automático        | sí                     |
| `updatedAt`    | fecha            | sí          | no    | automático        | sí                     |
| `lastLoginAt`  | fecha            | no          | no    | null              | sí                     |
| `avatarUrl`    | texto            | no          | no    | null              | sí                     |
| `phone`        | texto            | no          | si    | no                | sí                     |
| `bio`          | texto            | no          | no    | no                | sí                     |
