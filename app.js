const express = require('express');
const { connectToDB } = require('./config/conexionBD'); // Importamos la conexión a la base de datos
const clienteRoutes = require('./routers/clientes');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar el body de las peticiones como JSON
app.use(express.json());
//rutas
app.use('/clientes', clienteRoutes);
// Definir una ruta simple
app.get('/', (req, res) => {
    res.send('¡Hola! Conexión a SQL Server funcionando. Prueba Fabiola');
});

// Iniciar el servidor y conectar a la base de datos
connectToDB().then(() => {
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error al conectar a la base de datos o iniciar el servidor:', err);
});
