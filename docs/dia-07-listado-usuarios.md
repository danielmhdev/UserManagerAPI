# Día 7: Listado de usuarios en memoria

## Qué he hecho

- He creado un tipo User en TypeScript.
- He creado un array de usuarios en memoria.
- He actualizado el endpoint GET /api/users.
- He devuelto un listado de usuarios en formato JSON.
- He añadido el total de usuarios en la respuesta.
- He comprobado que no se devuelven contraseñas.

## Endpoint trabajado

```http
GET /api/users
```

## Respuesta obtenida

```json
{
  "message": "Listado de usuarios",
  "total": 3,
  "data": [
    {
      "id": 1,
      "name": "Ana García",
      "email": "ana@email.com",
      "role": "USER",
      "isActive": true
    }
  ]
}
```

## Explicación personal

Trabajar en memoria significa que los datos están guardados temporalmente
mientras el servidor está encendido. Si reinicio el servidor, los datos vuelven
al estado inicial.


## Tabla de comprobación

| Comprobación | Resultado | Justificación / Observación |
| --- | --- | --- |
| La ruta `GET /api/users` responde | **Sí** | Definida correctamente con `app.get("/api/users", ...)`. |
| El status code es `200` | **Sí** | Se especifica explícitamente con `res.status(200)`. |
| La respuesta contiene `message` | **Sí** | Devuelve `"message": "Listado de Usuarios"`. |
| La respuesta contiene `total` | **Sí** | Devuelve `"total": users.length` (`6`). |
| La respuesta contiene `data` | **Sí** | Devuelve `"data": users`. |
| `data` es un array | **Sí** | `users` está definido como `User[]` (un array de objetos). |
| Los usuarios no incluyen contraseña | **Sí** | El tipo `User` y los objetos creados no contienen ningún campo `password`. |

![Usuarios con Array](/docs/images/get-usuarios-array.png)
---

## Memoria vs base de datos

### 1. ¿Qué significa guardar datos en memoria?
Guardar datos en memoria significa almacenar la información directamente en la **memoria RAM** del ordenador o servidor mientras la aplicación se está ejecutando por ejemplo, mediante una variable global como `const users = [...]` en el código de Express. 

Es un tipo de almacenamiento temporal con velocidades de lectura y escritura ultra rápidas.

### 2. ¿Qué problema tiene?
El principal inconveniente de guardar datos en memoria es la **volatilidad (falta de persistencia)**:
* **Pérdida total al reiniciar:** Si el proceso del servidor se detiene, se reinicia (por ejemplo, al guardar cambios con Nodemon/ts-node) o el servidor se apaga, **todos los datos acumulados se borran inmediatamente**.
* **No modifica el código fuente:** Aunque añadamos elementos a un array en tiempo de ejecución, el archivo original (`server.ts`) nunca se modifica.
* **Incompatibilidad con múltiples servidores:** Si la API se despliega en varias máquinas a la vez (escalado), la memoria RAM de una máquina no está sincronizada con la de las demás.

### 3. ¿Por qué más adelante necesitaremos una base de datos?
Necesitaremos una base de datos (como PostgreSQL) para resolver las limitaciones de la memoria RAM:
* **Garantiza la persistencia:** Escribe los datos en el disco duro de forma permanente, asegurando que la información de los usuarios o pacientes nunca se pierda ante apagones o despliegues.
* **Maneja gran volumen de datos:** Permite almacenar y consultar millones de registros eficientemente mediante índices y SQL sin saturar la memoria RAM.
* **Concurrencia e integridad:** Permite que múltiples usuarios accedan y modifiquen datos al mismo tiempo garantizando la coherencia e integridad de la información.