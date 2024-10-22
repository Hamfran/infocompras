
const { poolPromise,sql } = require('../config/conexionBD'); // Asegúrate de tener conexión a la base de datos

// Función para insertar una nueva licitación
exports.insertLicitacion = async (req, res) => {
    const { ID_SOLICITUD, FECHA_PUBLICACION, FECHA_CIERRE, ESTADO } = req.body; // Asegúrate de enviar estos datos en el cuerpo de la solicitud

    // Validación para asegurar que no hay valores nulos o indefinidos
    if (!ID_SOLICITUD || !FECHA_PUBLICACION || !FECHA_CIERRE || !ESTADO) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y no pueden ser nulos' });
    }

    try {
        // Realizar la consulta para insertar una nueva licitación
        const pool = await poolPromise;
        await pool.request()
            .input('ID_SOLICITUD', sql.Int, ID_SOLICITUD)
            .input('FECHA_PUBLICACION', sql.DateTime, FECHA_PUBLICACION)
            .input('FECHA_CIERRE', sql.DateTime, FECHA_CIERRE)
            .input('ESTADO', sql.VarChar(50), ESTADO)
            .query('INSERT INTO LICITACION (ID_SOLICITUD, FECHA_PUBLICACION, FECHA_CIERRE, ESTADO) VALUES (@ID_SOLICITUD, @FECHA_PUBLICACION, @FECHA_CIERRE, @ESTADO)');

        res.status(201).json({ message: 'Licitación insertada correctamente' });
    } catch (err) {
        console.error('Error al insertar licitación:', err);
        res.status(500).json({ message: 'Error en la base de datos al insertar licitación' });
    }
};

// Función para actualizar una licitación
exports.updateLicitacion = async (req, res) => {
    const { ID_LICITACION, ID_SOLICITUD, FECHA_PUBLICACION, FECHA_CIERRE, ESTADO } = req.body; // Asegúrate de enviar estos datos en el cuerpo de la solicitud

    // Validación para asegurar que no hay valores nulos o indefinidos
    if (!ID_LICITACION || !ID_SOLICITUD || !FECHA_PUBLICACION || !FECHA_CIERRE || !ESTADO) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y no pueden ser nulos' });
    }

    try {
        // Realizar la consulta para actualizar la licitación
        const pool = await poolPromise;
        await pool.request()
            .input('ID_LICITACION', sql.Int, ID_LICITACION)
            .input('ID_SOLICITUD', sql.Int, ID_SOLICITUD)
            .input('FECHA_PUBLICACION', sql.DateTime, FECHA_PUBLICACION)
            .input('FECHA_CIERRE', sql.Datetime, FECHA_CIERRE)
            .input('ESTADO', sql.VarChar(50), ESTADO)
            .query('UPDATE LICITACION SET ID_SOLICITUD = @ID_SOLICITUD, FECHA_PUBLICACION = @FECHA_PUBLICACION, FECHA_CIERRE = @FECHA_CIERRE, ESTADO = @ESTADO WHERE ID_LICITACION = @ID_LICITACION');

        res.status(200).json({ message: 'Licitación actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar licitación:', err);
        res.status(500).json({ message: 'Error en la base de datos al actualizar licitación' });
    }
};
