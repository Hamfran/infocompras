const express = require('express');
const { poolPromise } = require('./config/conexionBD'); // Importamos la conexión a la base de datos
const clienteRoutes = require('./routers/Usuarios');
const proveedorRoutes= require('./routers/Proveedor');
const verproveedorRoutes= require('./routers/Proveedor');
const selectGuatemalaRouter=require('./routers/selectGuatemala');
const imprimirpdfRouters=require('./routers/Proveedor');
const licitacionRoutes = require('./routers/Licitacion'); // rutas para departamentos
const generarsolicitudRoutes = require('./routers/Solicitud'); // rutas para departamentos
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar datos en formato JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('Manager')); // Aquí estamos sirviendo la carpeta 'Manager'
//rutas
app.use('/Usuarios', clienteRoutes);

// Agregar esta línea para los departamentos
app.use('/Registro', proveedorRoutes);

app.use('/Verproveedores', verproveedorRoutes);
app.use('/imprimirpdf', imprimirpdfRouters);
//Nuevo de solicitud
app.use('/Solicitud', generarsolicitudRoutes);
//click en el departamento en svg
app.use('/Buscardepa', selectGuatemalaRouter);
// Definir una ruta simple
app.use('/Licitacion', licitacionRoutes);

app.get('/', (req, res) => {
    res.send('¡Hola! Conexión a SQL Server funcionando.');
});

// Iniciar el servidor y conectar a la base de datos
poolPromise.then(() => {
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}/login.html`);
    });
}).catch(err => {
    console.error('Error al conectar a la base de datos o iniciar el servidor:', err);
});
