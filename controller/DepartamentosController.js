const sql = require('mssql');
const conexionBD = require('../config/conexionBD'); // Asegúrate de tener conexión a la base de datos
const bcrypt = require('bcrypt'); // Para encriptar contraseñas


// Nueva función para obtener todos los departamentos
exports.getDepartamentos = async (req, res) => {
    try {
        // Realizar la consulta para obtener todos los departamentos
        const pool = await sql.connect(conexionBD);
        const result = await pool.request()
            .query('SELECT ID_DEPARTAMENTO, NOMBRE FROM DEPARTAMENTO');

        // Enviar la lista de departamentos como respuesta
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error al obtener departamentos:', err);
        res.status(500).json({ message: 'Error en la base de datos al obtener departamentos' });
    }
};
