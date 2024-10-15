const sql = require('mssql');
const  conexionBD= require('../config/conexionBD'); // Asegúrate de tener conexión a la base de datos



exports.proveedor = async (req, res) => {
    const { nombre, contacto, nit, correo } = req.body;

    try {
        
        const query = `
            INSERT INTO PROVEEDOR (NOMBRE, CONTACTO, NIT, CORREO)
            VALUES (@nombre, @cpntacto, @nit, @correo)`;

        // Realizar la inserción
        const pool = await sql.connect();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('contacto', sql.VarChar, contacto)
            .input('nit', sql.Int, nit)
            .input('correo', sql.VarChar, correo)
            .query(query);

        // Enviar respuesta de éxito
        res.status(201).json({ message: 'PROVEEDOR REGISTRADO CORRECTAMENTE' });

    } catch (err) {
        console.error('Error al registrar proveedor:', err);
        res.status(500).json({ message: 'Error en la base de datos' });
    }
};