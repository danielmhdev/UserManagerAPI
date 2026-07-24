// import express from "express";

const app = express(); // Creamos una instancia de la aplicación Express
const PORT = 3000; // Definimos el puerto en el que escuchará el servidor

app.use(express.json()); //Permite leer JSON en las solicitudes entrantes

app.get("/", (req, res) => { // Creamos una ruta GET en la raíz del servidor
  res.json({
     "name": "UserManager API",
     "version": "1.0.0",
     "status": "running",
     "author": "Daniel M.H.",
    "endpoints de ejemplo": {
        "GET /users": "Obtiene todos los usuarios",
        "POST /users": "Crea un nuevo usuario",
        "GET /users/:id": "Obtiene un usuario por ID",
        "PUT /users/:id": "Actualiza un usuario por ID",
        "DELETE /users/:id": "Elimina un usuario por ID",
        },
    });
});

app.get("/api/info", (req, res) => { // Creamos una ruta GET para obtener información de la API
    res.json({
            "project": "UserManager API",
            "description": "API REST para gestionar usuarios",
            "day": 2,
            "technologies": ["Node.js", "Express", "TypeScript"],
        });
    });


app.listen(PORT, () => { //Arrancamos el servidor y escuchamos en el puerto definido
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});