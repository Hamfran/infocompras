const express = require('express');
const { poolPromise } = require('./config/conexionBD'); // Importamos la conexión a la base de datos
const clienteRoutes = require('./routers/Usuarios');
const proveedorRoutes= require('./routers/Proveedor')
const verproveedorRoutes= require('./routers/Proveedor')
const departamentosRoutes = require('./routers/Departamentos'); // rutas para departamentos
const dotenv = require('dotenv');


const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar datos en formato JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('Manager')); // Aquí estamos sirviendo la carpeta 'Manager'
//rutas
app.use('/Usuarios', clienteRoutes);

app.use('/Departamentos', departamentosRoutes); 
// Agregar esta línea para los departamentos
app.use('/Registro', proveedorRoutes);

app.use('/Verproveedores', verproveedorRoutes);
// Definir una ruta simple
app.get('/', (req, res) => {
    res.send('¡Hola! Conexión a SQL Server funcionando.');
});

// Iniciar el servidor y conectar a la base de datos
poolPromise.then(() => {
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error al conectar a la base de datos o iniciar el servidor:', err);
});
