
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

// Función para actualizar una licitación por ID_LICITACION 
exports.updateLicitacion = async (req, res) => {
    const { ID_LICITACION, ID_SOLICITUD, FECHA_PUBLICACION, FECHA_CIERRE, ESTADO } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!ID_LICITACION || !ID_SOLICITUD || !FECHA_PUBLICACION || !FECHA_CIERRE || !ESTADO) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y no pueden ser nulos o indefinidos' });
    }

    try {
        // Obtener la conexión del pool de la base de datos
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID_LICITACION', sql.Int, ID_LICITACION) // El ID por el que se hará la actualización
            .input('ID_SOLICITUD', sql.Int, ID_SOLICITUD)
            .input('FECHA_PUBLICACION', sql.DateTime, FECHA_PUBLICACION)
            .input('FECHA_CIERRE', sql.DateTime, FECHA_CIERRE)
            .input('ESTADO', sql.VarChar(50), ESTADO)
            .query(`
                UPDATE LICITACION 
                SET ID_SOLICITUD = @ID_SOLICITUD, 
                    FECHA_PUBLICACION = @FECHA_PUBLICACION, 
                    FECHA_CIERRE = @FECHA_CIERRE, 
                    ESTADO = @ESTADO 
                WHERE ID_LICITACION = @ID_LICITACION
            `);

        if (result.rowsAffected[0] === 0) {
            // Si no se encontró ningún registro para actualizar
            return res.status(404).json({ message: `No se encontró ninguna licitación con el ID ${ID_LICITACION}` });
        }

        // Si la actualización fue exitosa
        res.status(200).json({ message: 'Licitación actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar licitación:', err);
        res.status(500).json({ message: 'Error en la base de datos al actualizar la licitación' });
    }
};



// Función para buscar una licitación por ID
exports.getLicitacion = async (req, res) => {
    const  ID_LICITACION = req.params.id; // El ID_LICITACION se envía como parámetro en la URL

    // Validación para asegurar que se envíe un ID_LICITACION
    if (!ID_LICITACION) {
        return res.status(400).json({ message: 'El ID de la licitación es obligatorio' });
    }

    try {
        // Realizar la consulta para obtener la licitación por ID_LICITACION
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID_LICITACION', sql.Int, ID_LICITACION)
            .query('SELECT * FROM LICITACION WHERE ID_LICITACION = @ID_LICITACION');

        // Verificar si se encontró una licitación
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Licitación no encontrada' });
        }

        // Devolver la licitación encontrada
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error al buscar la licitación:', err);
        res.status(500).json({ message: 'Error en la base de datos al buscar la licitación' });
    }
};
// Función para buscar una solicitud por ID de solicitud
exports.getFechaSolicitud = async (req, res) => {
    const ID_SOLICITUD = req.params.id; // El ID_SOLICITUD se envía como parámetro en la URL

    // Validación para asegurar que se envíe un ID_SOLICITUD
    if (!ID_SOLICITUD) {
        return res.status(400).json({ message: 'El ID de la solicitud es obligatorio' });
    }

    try {
        // Realizar la consulta para obtener la fecha de solicitud por ID_SOLICITUD
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ID_SOLICITUD', sql.Int, ID_SOLICITUD)
            .query('SELECT FECHA_SOLICITUD FROM SOLICITUD_LICITACION WHERE ID_SOLICITUD = @ID_SOLICITUD');

        // Verificar si se encontró una solicitud
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Devolver la fecha de la solicitud encontrada
        res.status(200).json(result.recordset[0]); // Retorna solo FECHA_SOLICITUD
    } catch (err) {
        console.error('Error al buscar la solicitud:', err);
        res.status(500).json({ message: 'Error en la base de datos al buscar la solicitud' });
    }
};

