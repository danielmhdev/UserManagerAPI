# Día 21 - Modelo Prisma User

## Qué he hecho

- He abierto el archivo prisma/schema.prisma.
- He añadido el enum Role.
- He definido el modelo User.
- He marcado id como clave primaria.
- He marcado email como único.
- He añadido passwordHash.
- He definido role con valor por defecto USER.
- He definido isActive con valor por defecto true.
- He añadido createdAt y updatedAt.
- He validado el esquema con Prisma.
- He generado Prisma Client.

## Modelo definido

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

## Explicación de campos

| Campo | Explicación |
|---|---|
| `id` | Identificador único del usuario |
| `name` | Nombre visible |
| `email` | Email único |
| `passwordHash` | Hash de la contraseña |
| `role` | Rol del usuario |
| `isActive` | Indica si la cuenta está activa |
| `createdAt` | Fecha de creación |
| `updatedAt` | Fecha de última modificación |

## Comandos usados

```bash
npx prisma validate
npx prisma generate
```

## Explicación personal

El modelo User en Prisma representa cómo se guardarán los usuarios en la base de datos. Todavía no hemos creado la tabla real, pero ya hemos definido su estructura principal.

## Atributos usados en el modelo

En Prisma, los atributos que empiezan por `@` se aplican sobre campos específicos para definir reglas, restricciones y comportamientos automáticos en la base de datos:

* **`@id`:** Marca el campo como la **clave primaria** (*Primary Key*) del modelo. Garantiza que cada registro tenga un identificador único e irrepetible en la tabla.
* **`@default(...)`:** Asigna un **valor por defecto** al campo si no se proporciona uno de forma explícita al crear el registro (por ejemplo, `@default(now())` para la fecha actual o `@default(true)` para booleanos).
* **`@unique`:** Establece una restricción de **unicidad**. Impide que existan dos registros con el mismo valor en toda la tabla (fundamental para campos como `email`).
* **`@updatedAt`:** Automatiza el **control de modificaciones**. Cada vez que un registro se edita o actualiza, Prisma asigna automáticamente la fecha y hora actuales a esa columna.

## Enum Role

Utilizar un `enum` para definir los roles en lugar de permitir texto libre (`String`) es una buena práctica fundamental en el diseño de bases de datos por las siguientes razones:

1. **Validación e integridad de datos:** Restringe los valores permitidos tanto en PostgreSQL como en la aplicación. Impide que se inserten por error valores inconsistentes, tipografías erróneas o variantes como `"admin"`, `"Admin"`, `"ADMINISTRADOR"` o `"User"`.
2. **Autocompletado y *Type Safety* en TypeScript:** Prisma genera un tipo estático a partir del `enum`. En tu código backend, la API solo aceptará valores válidos (`Role.USER` o `Role.ADMIN`), ofreciendo sugerencias automáticas en el editor y detectando fallos en tiempo de compilación.
3. **Documentación clara del dominio:** Define explícitamente en el archivo de configuración cuáles son los únicos niveles de acceso que existen en el sistema. Cualquier desarrollador sabrá qué roles hay disponibles sin necesidad de inspeccionar los datos de la base de datos.
4. **Mantenibilidad y escalabilidad:** Si en el futuro necesitas añadir un nuevo perfil (por ejemplo, `MODERATOR` o `SUPERADMIN`), basta con agregarlo al `enum` en `schema.prisma`. El compilador de TypeScript te indicará inmediatamente qué partes del código requieren actualización para soportar el nuevo rol.


## Módelo y reglas de negocio

| Regla de negocio | Campo o atributo Prisma relacionado |
| --- | --- |
| **El email no se puede repetir** | `@unique` (en el campo `email`) |
| **Todo usuario tiene un identificador único** | `@id` (con `@default(autoincrement())`) |
| **Todo usuario empieza activo** | `@default(true)` (en el campo `isActive`) |
| **El rol por defecto es USER** | `@default(USER)` (en el campo `role`) |
| **La fecha de creación se asigna automáticamente** | `@default(now())` (en el campo `createdAt`) |
| **La fecha de modificación se actualiza al cambiar el usuario** | `@updatedAt` (en el campo `updatedAt`) |

## Campos futuros User

```prisma
lastLoginAt  DateTime @default(now())
avatarUrl    String   @default("url_default")
phone        String?  @unique
bio          String?
```

## Por qué no ejecutamos migraciones hoy

Hoy nos hemos centrado exclusivamente en la **definición y validación del modelo** dentro del archivo `schema.prisma`. Dejar la ejecución de la migración para la siguiente sesión responde a los siguientes motivos principales:

1. **Validación previa del diseño:** Antes de alterar la estructura física de la base de datos relacional, es necesario revisar y confirmar que los campos, tipos de datos, restricciones (`@unique`, `@id`), opcionalidades y reglas de negocio estén correctamente configurados.
2. **Historial de migraciones limpio:** Cada vez que se ejecuta `npx prisma migrate dev`, Prisma genera un archivo de migración `.sql` irreversible y versionado en el proyecto. Trabajar primero sobre el borrador del esquema evita generar migraciones innecesarias, corregir errores sobre la marcha o ensuciar el historial de cambios de la base de datos.
3. **Separación de conceptos:** Desacoplamos la fase de **modelado teórico** (entender y estructurar la sintaxis de Prisma) de la fase de **infraestructura y persistencia** (ejecutar los cambios reales en el contenedor de PostgreSQL mediante Docker).