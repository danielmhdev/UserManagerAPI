# Día 14 - Códigos de estado HTTP

## Qué he hecho

- He revisado los códigos HTTP utilizados en la API.
- He probado respuestas correctas con `200 OK`.
- He probado creación con `201 Created`.
- He probado errores de validación con `400 Bad Request`.
- He probado usuario inexistente con `404 Not Found`.
- He probado email duplicado con `409 Conflict`.
- He comprobado que el código HTTP coincide con el mensaje JSON.

## Tabla resumen

| Código | Significado | Cuándo lo uso |
| ---: | --- | --- |
| 200 | OK | Cuando la petición se procesa correctamente |
| 201 | Created | Cuando se crea un usuario |
| 400 | Bad Request | Cuando la petición tiene datos incorrectos |
| 404 | Not Found | Cuando el usuario no existe |
| 409 | Conflict | Cuando el email ya está registrado |

## Casos probados

## Casos probados

| Petición | Caso | Código esperado | Código obtenido | ¿Correcto? |
| --- | --- | ---: | ---: | --- |
| `GET /api/health` | Health | 200 | 200 | Sí |
| `GET /api/users` | Listado | 200 | 200 | Sí |
| `GET /api/users/1` | Usuario existente | 200 | 200 | Sí |
| `GET /api/users/999` | Usuario inexistente | 404 | 404 | Sí |
| `GET /api/users/abc` | ID inválido | 400 | 400 | Sí |
| `POST /api/users` | Creación correcta | 201 | 201 | Sí |
| `POST /api/users` | Datos inválidos | 400 | 400 | Sí |
| `POST /api/users` | Email duplicado | 409 | 409 | Sí |
| `PATCH /api/users/1` | Actualización correcta | 200 | 200 | Sí |
| `PATCH /api/users/999` | Usuario inexistente | 404 | 404 | Sí |
| `DELETE /api/users/1` | Desactivación correcta | 200 | 200 | Sí |

## Explicación personal

Los códigos de estado HTTP permiten que el cliente entienda rápidamente qué ha
pasado con una petición. No basta con devolver un JSON; el código HTTP también
debe ser coherente con el resultado.


## Cómo decido qué código usar

| Situación | Código que usaría | Motivo |
| --- | ---: | --- |
| **Usuario creado correctamente** | 201 | **Created:** La petición ha tenido éxito y se ha creado un nuevo recurso en la base de datos/array. |
| **Usuario no encontrado** | 404 | **Not Found:** El recurso solicitado (por id o criterio específico) no existe en el servidor. |
| **ID no numérico** | 400 | **Bad Request:** La petición contiene parámetros sintácticamente inválidos o con un tipo de dato incorrecto. |
| **Email duplicado** | 409 | **Conflict:** La petición entra en conflicto directo con las reglas de negocio y los datos ya existentes (unicidad de email). |
| **Falta un campo obligatorio** | 400 | **Bad Request:** El cuerpo de la petición (`body`) está incompleto y viola las validaciones de entrada del endpoint. |
| **Usuario actualizado correctamente** | 200 | **OK:** La petición `PATCH` o `PUT` se procesó con éxito y se devuelven los datos actualizados del recurso. |

## Diferencia entre 400, 404 y 409

A la hora de diseñar una API REST, es fundamental categorizar correctamente los errores del cliente para que el frontend o la aplicación consumidora sepan exactamente qué ha fallado y cómo solucionarlo.

### 1. 400 Bad Request — Error en la petición (Formato / Sintaxis)
Indica que el servidor no puede procesar la petición porque está **mal construida, incompleta o contiene tipos de datos incorrectos**. Es un fallo de validación de entrada antes de intentar operar con los datos.

* **La clave:** El problema está en *cómo se envían los datos*.
* **Ejemplo en UserManager API:**
  * Enviar un ID con letras al buscar un usuario (`GET /api/users/abc`).
  * Enviar un objeto `JSON` sin el campo obligatorio `password` o con un email sin `@` al crear un usuario (`POST /api/users`).

---

### 2. 404 Not Found — Recurso no encontrado
Indica que la petición está bien estructurada, pero el **recurso solicitado no existe** en el servidor o la ruta no está definida.

* **La clave:** El cliente pregunta por algo específico que *no se puede localizar*.
* **Ejemplo en UserManager API:**
  * Solicitar un usuario con un ID numérico válido pero que no existe en el array (`GET /api/users/999`).
  * Intentar actualizar o desactivar un ID inexistente (`PATCH /api/users/999` o `DELETE /api/users/999`).

---

### 3. 409 Conflict — Conflicto con el estado actual
Indica que la petición está **bien formada sintácticamente** (pasa todas las validaciones de tipo de dato), pero no se puede ejecutar porque **viola una regla de negocio o entra en colisión con los datos que ya existen**.

* **La clave:** Los datos son válidos por sí solos, pero *chocan contra la base de datos*.
* **Ejemplo en UserManager API:**
  * Intentar registrar un nuevo usuario (`POST /api/users`) o actualizar el correo de uno existente (`PATCH /api/users/1`) usando un email que ya está en uso por otra persona en el array `users`.

---

### Resumen rápido para recordar

| Código | ¿Qué falla? | Metáfora sencilla |
| --- | --- | --- |
| **400 Bad Request** | La sintaxis / formato | El formulario está mal rellenado o incompleto. |
| **404 Not Found** | La existencia | Buscas la ficha de un cliente que no existe en el archivo.|
| **409 Conflict** | La regla de duplicidad | Intentas dar de alta a alguien con un DNI o email que ya pertenece a otro cliente.|


##  401 Unauthorized vs 403 Forbidden

Aunque todavía no hemos implementado autenticación en nuestra API, es fundamental entender la diferencia entre estos dos códigos de estado HTTP, ya que serán la pieza clave cuando añadamos **JWT (JSON Web Tokens)** y **gestión de roles (USER, ADMIN, etc.)**.

---

### 1. 401 Unauthorized — Sin autenticación (¿Quién eres?)
Indica que la petición no se ha procesado porque **el cliente no ha acreditado su identidad** o las credenciales aportadas no son válidas / han caducado.

* **La clave:** El servidor no sabe quién eres. Falta el "carné de identidad" (el Token JWT) o es inválido.
* **Ejemplo en el futuro de la API:** 
  * Intentar acceder a un endpoint privado como `GET /api/users` sin enviar el token JWT en la cabecera `Authorization`.
  * Enviar un token JWT caducado o manipulado.
* **Respuesta típica del cliente:** Redirigir al usuario a la pantalla de *Login*.

---

### 2. 403 Forbidden — Sin permisos / Prohibido (¿Qué puedes hacer?)
Indica que el servidor **sí sabe quién eres** (estás correctamente autenticado), pero tu usuario **no tiene los permisos o el rol necesario** para ejecutar esa acción específica.

* **La clave:** El servidor sabe quién eres, pero te dice: *"Lo siento, no tienes permiso para tocar esto"*.
* **Ejemplo en el futuro de la API:** 
  * Un usuario con rol `USER` intenta eliminar a otro usuario ejecutando `DELETE /api/users/2` (acción reservada únicamente para el rol `ADMIN`).
  * Un usuario normal intenta acceder al panel global de métricas del servidor.
* **Respuesta típica del cliente:** Mostrar un mensaje tipo *"No tienes permisos suficientes para realizar esta acción"*.

---

### Resumen para recordar

| Código | Concepto principal | Pregunta que hace el servidor | Ejemplo en la vida real |
| --- | --- | --- | --- |
| **401 Unauthorized** | Autenticación | *"¿Quién eres? Enséñame tu credencial."* | No te dejan entrar al edificio porque no llevas acreditación. |
| **403 Forbidden** | Autorización / Permisos | *"Sé quién eres, pero ¿tienes permiso para entrar aquí?"* | Entras al edificio con tu acreditación, pero intentas pasar a la sala de servidores donde solo entra el equipo de IT. |