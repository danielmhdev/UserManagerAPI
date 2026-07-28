import express from "express";

const app = express(); // Creamos una instancia de la aplicación Express
const PORT = 3000; // Definimos el puerto en el que escuchará el servidor

app.use(express.json()); //Permite leer JSON en las solicitudes entrantes(POST,PUT...)

// Creamos un endpoint con GET en la raíz del servidor
app.get("/", (req, res) => { 
  res.json({
     name: "UserManager API",
     version: "1.0.0",
     status: "running",
     author: "Daniel M.H.",
    });
});

// Creamos un endpoint con GET para obtener información de la API
app.get("/api/info", (req, res) => { 
    res.json({
            project: "UserManager API",
            description: "API REST para gestionar usuarios",
            day: 2,
            technologies: ["Node.js", "Express", "TypeScript"],
        });
    });

// Creamos un endpoint con GET para verificar el estado de la API
app.get("/api/health", (req, res) =>{ 
    res.status(200).json({
        status: "200 OK",
        message: "UserManager API funcionando correctamente",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        environment: "development"
    });
});

// Creamos un endpoint con GET para verificar la latencia de la API
app.get("/api/ping", (req, res) => { 
    res.json({
        message: "pong",
        timestamp: new Date().toISOString(), 
    });
});

// Creamos un endpoint con GET para obtener todos los usuarios
app.get("/api/users", (req, res) => { 
    res.status(200).json({
        message: "Listado de Usuarios",
        data: []
    });
});

// Creamos un endpoint con GET para obtener un usuario por id
app.get("/api/users/:id", (req, res) => { 
    const {id} = req.params; // Obtenemos el id del usuario desde los parámetros de la solicitud

    res.status(200).json({
        message: "Detalle de usuario",
        id: id 
    });
});

//Creamos un endpoint con POST para crear un nuevo usuario
app.post("/api/users", (req, res) => { 
    const userData = req.body; // Obtenemos los datos del usuario desde el cuerpo de la solicitud
    res.status(201).json({
        message: "Usuario recibido y creado correctamente",
        data: userData 
    });
});

// Creamos una endpoint PATCH para actualizar un usuario existente
app.patch("/api/users/:id", (req, res) => {
    const {id} = req.params;
    const updateData = req.body; // Obtenemos los datos de actualización desde el cuerpo de la solicitud
    res.status(200).json({
        message: `Usuario actualizado correctamente`,
        id: id,
        data: updateData 
    });
});

// Creamos un endpoint DELETE para eliminar un usuario existente
app.delete("/api/users/:id", (req, res) => {
    const {id} = req.params;
    res.status(200).json({
        message: `Usuario eliminado correctamente`,
        id: id 
    });
});

// Creamos un enpoint con GET para consultar nuestro perfil
app.get("/api/users/me", (req, res) => {
    res.status(200).json ({
        id: 1,
        name: "Daniel M.H",
        email: "daniel@email.com",
        role: "USER",
        isActive: true
    });
});

// Creamos un endpoint para cambiar estado
app.patch("/api/users/:id/status", (req, res) =>{
    const {id} = req.params;
    const updateData = req.body;

    res.status(200).json({
        message: "Estado de usuario recibido para actualizar",
        id: id,
        isActive: updateData,
    });
});

// Creamos un endpoint para cambiar rol
app.patch("/api/users/:id/role", (req, res) => {
    const {id} = req.params;
    const updateData = req.body;

    res.status(200).json ({
        message: "Rol de usuario recibido para actualizar",
        id: id,
        role: updateData
    });
});
//Arrancamos el servidor y escuchamos en el puerto definido
app.listen(PORT, () => { 
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});