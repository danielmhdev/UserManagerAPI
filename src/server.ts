// DÍA 2 - Preparación Proyecto

import express from "express";

const app = express(); // Creamos una instancia de la aplicación Express
const PORT = 3000; // Definimos el puerto en el que escuchará el servidor

// DÍA 6 - Listado de usuarios y total de usuarios
// Creamos un usuario de ejemplo para la API para probar la persistencia de datos.
type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
// Datos temporales en memoria. Más adelante se sustituirán por una base de datos.
const users: User[] = [
  {
    id: 1,
    name: "Ana García",
    email: "ana@email.com",
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@email.com",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Laura Martínez",
    email: "laura@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Daniel Martínez",
    email: "daniel@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Juan Gómez",
    email: "juan@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Jordi Cido",
    email: "jordi@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

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

// DÍA 3 - Primeros endpoints de la API
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

// DÍA 4 - Metodos hhtp y parámetros de ruta

// Creamos un endpoint con GET para obtener todos los usuarios
app.get("/api/users", (req, res) => { 
    res.status(200).json({
        message: "Listado de Usuarios",
        data: []
    });
});

// Creamos un endpoint con GET para obtener un usuario por id
app.get("/api/users/id/:id", (req, res) => { 
    const {id} = req.params; // Obtenemos el id del usuario desde los parámetros de la solicitud

    res.status(200).json({
        message: "Detalle de usuario",
        id: id 
    });
});

//Creamos un endpoint con POST para crear un nuevo usuario
app.post("/api/users", (req, res) => { 
    const userData = req.body; // Obtenemos los datos del usuario desde el cuerpo de la solicitud
    console.log("Body recibido en POST /api/users:", userData); // AÑADIDO DÍA 6
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
    const {isActive} = req.body;

    res.status(200).json({
        message: "Estado de usuario recibido para actualizar",
        id: id,
        isActive: isActive,
    });
});

// Creamos un endpoint para cambiar rol
app.patch("/api/users/:id/role", (req, res) => {
    const {id} = req.params;
    const {role} = req.body;

    res.status(200).json ({
        message: "Rol de usuario recibido para actualizar",
        id: id,
        role: role,
    });
});

// DÍA 5 - JSON, body, params y headers

//Creamos un endpoint para probar body
app.post("/api/debug/body", (req, res) => {
    res.status(200).json({
        message: "Datos recibidos correctamente",
        body: req.body // Más corto y concsiso que userData = req.body para devolver los datos recibidos en el cuerpo de la solicitud, 
                        // se usa para debuggear y ver que datos se reciben en el body de la solicitud.
    });
});

// Creamos un endopoint para probar params
// Por ejemplo: http://localhost:3000/api/debug/params/1 nos devolverá un objeto con el id recibido en los params.
app.get("/api/debug/params/:id", (req, res) => {
    res.status(200).json({
        message: "Parámetros recibidos correctamente",
        params: req.params 
    });
});

// Creamos un endpoint para probar query params
// Por ejemplo: http://localhost:3000/api/debug/query?role=ADMIN&isActive=true nos devolverá un objeto con los query params recibidos.
app.get("/api/debug/query", (req, res) => {
    res.status(200).json({
        message: "Query params recibidos correctamente",
        query: req.query 
    });
});


// Creamos un endpoint para probar headers
// Por ejemplo: http://localhost:3000/api/debug/headers nos devolverá un objeto con los headers recibidos.
app.get("/api/debug/headers", (req, res) => {
    res.status(200).json({
        message: "Headers recibidos correctamente",
        headers: req.headers,
    });
});

// Creamos un endopoint combinando params, query y headers
// Por ejemplo: http://localhost:3000/api/debug/users/7?notify=true
app.patch("/api/debug/users/:id", (req, res) => {
    const {id} = req.params;
    const {notify} = req.query;
    const authorization = req.headers.authorization;
    const changes = req.body;

    res.status(200).json({
        message: "Datos combinados recibidos",
        id,
        notify,
        authorization,
        changes
    });
});

// Creamos un endpoint para probar una busqueda simulada
app.get("/api/users/search", (req, res) => {
    const {name, role} = req.query;
    res.status(200).json ({
         message: "Búsqueda de usuarios",
         filters: {
            name: name,
            role: role
        }
    });
});

// Creamos un endpoint de cambio de contraseña para un usuario
app.patch("/api/users/me/password", (req, res) => {
    const {currentPassword, newPassword} = req.body;

    res.status(200).json({
        message : "Solicitud de cambio de contraseña recibida"
    });
});


// Creamos un enpoint con un header personalizado
app.get("/api/debug/client", (req, res) => {
    const clientName = req.headers["x-client-name"];

    res.status(200).json({
        message: "Header personalizado recibido",
        clientName: clientName
    });
});

// DÍA 6 - Cliente HTTP y depuración

// Creamos un endopoint para depuracion
app.post("/api/debug/request", (req, res) => {
    res.status(200).json({
        message: "Información completa de la petición",
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query,
        headers: req.headers,
        body: req.body
    });
});

// Creamos un endpoint con header personalizado
app.post("/api/debug/request/headers", (req, res) => {
    const {message} = req.body;
    const nombreEstudiante = req.headers["x-student-name"];
    res.status(200).json ({
        message,
        nombreEstudiante
    });
});

// Creamos un endpoint para una actualización completa 
app.patch("/api/users/:id", (req, res) => {
    const {id} = req.params;
    const updateData = req.body;
    res.status(200).json({
        id,
        updateData
    });
});
// DÍA 7 - Listado de usuarios y total de usuarios

// Creamos un endpoint con GET para obtener todos los usuarios con el nuevo array
app.get("/api/users/array", (req, res) => { 
    res.status(200).json({
        message: "Listado de Usuarios",
        total: users.length,
        data: users
    });
});

// Conteo total de usuarios
app.get("/api/users/array/count", (req, res) => {
    const totalUsers = users.length;
    res.status(200).json({
        total : totalUsers
    });
});

// DÍA 8 - Consultar Usuario por ID
// Creamos un enpoint para consultar usuarios activos
app.get("/api/users/array/active", (req, res) => {
    const activeUsers = users.filter((user) => user.isActive);
    res.status(200).json({
        activeUsers
    });
});

// Creamos un endpoint con GET para obtener un usuario por id usando el array
app.get("/api/users/array/:id", (req, res) => { 
    const idParam = req.params.id; // Obtenemos el id del usuario desde los parámetros de la solicitud
    const id = Number(req.params.id); //Convertimos el id a número para poder compararlo con los ids del array de usuarios

    if (Number.isNaN(id)) { // Si el id no es un número, devolvemos un error 400
        return res.status(400).json({
        error: "El ID debe ser un número",
        receivedId: idParam
        });
    }

    const user = users.find((user) => user.id === id); // Buscamos el usuario en el array por id

    if (!user) { // Si no encontramos el usuario, devolvemos un error 404
        return res.status(404).json({
        error: "Usuario no encontrado",
        id
        });
    }

  return res.status(200).json({ // Si encontramos el usuario, devolvemos el usuario encontrado
    message: "Usuario encontrado",
    data: user
  });
});
// DÍA 9 - Crear usuarios en memoria
// Creamos un endpoint con POST para crear un nuevo usuario y añadirlo al array de usuarios
app.post("/api/users/array", (req, res) => {
  const {name, email, password} = req.body;
  const cleanName= name.trim();
  if (!cleanName || !email|| !password){
    return res.status(400).json({
        error:"name, email y password son obligatorios"
    });
  }

  if(password.length < 6){
    return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres"
    });
  };
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail.includes("@")) {
    return res.status(400).json({
        error: "El email no tiene un formato válido"
  });
}
  const existingUser = users.find((user) => user.email === normalizedEmail);

  
  if (existingUser) {
    return res.status(409).json({
      error: "El email ya está registrado"
    });
  }

  const newId = users.length > 0 // Si el array de usuarios no está vacío, generamos un nuevo id sumando 1 al id más alto existente, si está vacío, el nuevo id será 1
  ? Math.max(...users.map((user) => user.id)) + 1
  : 1;

  const newUser: User = { // Creamos un nuevo usuario con los datos recibidos y el nuevo id generado
  id: newId,
  name: cleanName,
  email: normalizedEmail,
  role: "USER",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

  users.push(newUser); // Añadimos el nuevo usuario al array de usuarios


  return res.status(201).json({
  message: "Usuario creado correctamente",
  data: newUser
});
});



//Arrancamos el servidor y escuchamos en el puerto definido
app.listen(PORT, () => { 
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});