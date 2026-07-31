# Día 8: Consultar usuario por ID

## Qué he hecho

- He actualizado el endpoint `GET /api/users/:id` para que usemos arrays.
- He leído el ID desde `req.params`.
- He convertido el ID de string a number.
- He validado si el ID es numérico.
- He buscado usuarios con `find`.
- He devuelto `404` cuando el usuario no existe.
- He probado diferentes casos desde Thunder Client o Postman.

## Endpoint trabajado

```http
GET /api/users/array/:id
GET api/users/array/active
```

## Casos probados

| Petición | Código esperado | Resultado | Observaciones / Cuerpo de la respuesta |
| --- | ---: | ---: | --- |
| `GET /api/users/array/1` | 200 | **200 OK** | Devuelve el usuario 1 (Ana García): `{"message": "Usuario encontrado", "data": {...}}` |
| `GET /api/users/array/2` | 200 | **200 OK** | Devuelve el usuario 2 (Carlos Pérez): `{"message": "Usuario encontrado", "data": {...}}` |
| `GET /api/users/array/999` | 404 | **404 Not Found** | El ID es un número válido pero no existe en el array: `{"error": "Usuario no encontrado"}` |
| `GET /api/users/array/abc` | 400 | **400 Bad Request** | `Number("abc")` da `NaN`, activa el primer `if`: `{"error": "El ID debe ser un número"}` |

## Explicación personal

El parámetro `:id` se recibe desde `req.params`. Como llega en formato string,
hay que convertirlo a number antes de compararlo con los id de los usuarios.

## Orden de rutas en Express

```http
1. /api/users/count
2. /api/users/active
3. /api/users/:id
```
Las rutas estáticas específicas `(/count, /active)` deben ir siempre antes que las rutas dinámicas con parámetros (/:id).
Dado que express lee el documento de arriba a abajo de forma secuencial y puede interpretar `/count o /active`como un ID en vez de como una ruta estática, dando lugar a errores.