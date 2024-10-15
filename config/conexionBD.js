require('dotenv').config();
const sql = require('mssql');

// Configuración de la conexión a SQL Server
const dbConfig = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true, // Usa esta opción para Azure
        trustServerCertificate: false, // True si no quieres verificar el certificado SSL
    }
};

// Crear y conectar el pool una vez
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};