const { poolPromise,sql } = require('../config/conexionBD');

// Función para insertar una nueva compra
exports.insertCompra = async (req, res) => {
    const { ID_ADJUDICACION, ID_LICITACION } = req.body; // Asegúrate de enviar estos datos en el cuerpo de la solicitud

    // Validación para asegurar que no hay valores nulos o indefinidos
    if (!ID_ADJUDICACION || !ID_LICITACION) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y no pueden ser nulos' });
    }

    try {
        const pool = await poolPromise;

        // Verificar si la compra ya existe
        const existingRecord = await pool.request()
            .input('ID_ADJUDICACION', sql.Int, ID_ADJUDICACION)
            .input('ID_LICITACION', sql.Int, ID_LICITACION)
            .query('SELECT COUNT(*) AS count FROM DETALLE_COMPRA WHERE ID_ADJUDICACION = @ID_ADJUDICACION AND ID_LICITACION = @ID_LICITACION');

        if (existingRecord.recordset[0].count > 0) {
            // Si ya existe, retornar un mensaje indicando que no se puede insertar
            return res.status(400).json({ message: 'La compra ya existe y no se puede registrar nuevamente' });
        }

        // Si no existe, proceder a insertar la nueva compra
        await pool.request()
            .input('ID_ADJUDICACION', sql.Int, ID_ADJUDICACION)
            .input('ID_LICITACION', sql.Int, ID_LICITACION)
            .query('INSERT INTO DETALLE_COMPRA (ID_ADJUDICACION, ID_LICITACION) VALUES (@ID_ADJUDICACION, @ID_LICITACION)');

        res.status(201).json({ message: 'Compra insertada correctamente' });
    } catch (err) {
        console.error('Error al insertar compra:', err);
        res.status(500).json({ message: 'Error en la base de datos al insertar compra' });
    }
};

// Controlador para buscar licitaciones activas
exports.buscarLicitacionesActivas = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Consulta para obtener la información de las licitaciones activas
        const query = `
            SELECT 
                l.ID_LICITACION,
                l.ID_SOLICITUD,
                l.FECHA_PUBLICACION,
                l.FECHA_CIERRE,
                l.ESTADO AS ESTADO_LICITACION,
                sl.ID_USUARIO,
                sl.CANTIDAD,
                sl.MONTO_TOTAL,
                sl.DESCRIPCION,
                cp.NOMBRE_CATEGORIA,
                d.NOMBRE AS NOMBRE_DEPARTAMENTO,
                p.NOMBRE_PRODUCTO,
                p.DESCRIPCION AS DESCRIPCION_PRODUCTO
            FROM 
                dbo.LICITACION l
            INNER JOIN 
                dbo.SOLICITUD_LICITACION sl ON l.ID_SOLICITUD = sl.ID_SOLICITUD
            INNER JOIN 
                dbo.CATEGORIA_PRODUCTO cp ON sl.ID_CATEGORIA = cp.ID_CATEGORIA
            INNER JOIN 
                dbo.DEPARTAMENTO d ON sl.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
            INNER JOIN 
                dbo.PRODUCTO p ON sl.ID_PRODUCTO = p.ID_PRODUCTO
            WHERE 
                l.ESTADO = 'Activo'
        `;

        const result = await pool.request().query(query);

        // Verificar si se encontraron resultados
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron licitaciones activas' });
        }

        // Retornar los resultados
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error al buscar licitaciones activas:', err);
        res.status(500).json({ message: 'Error en la base de datos al buscar licitaciones' });
    }
};

// Controlador para buscar licitaciones activas
exports.buscarLicitacionesInactivas = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Consulta para obtener la información de las licitaciones activas
        const query = `
            SELECT 
                l.ID_LICITACION,
                l.ID_SOLICITUD,
                l.FECHA_PUBLICACION,
                l.FECHA_CIERRE,
                l.ESTADO AS ESTADO_LICITACION,
                sl.ID_USUARIO,
                sl.CANTIDAD,
                sl.MONTO_TOTAL,
                sl.DESCRIPCION,
                cp.NOMBRE_CATEGORIA,
                d.NOMBRE AS NOMBRE_DEPARTAMENTO,
                p.NOMBRE_PRODUCTO,
                p.DESCRIPCION AS DESCRIPCION_PRODUCTO
            FROM 
                dbo.LICITACION l
            INNER JOIN 
                dbo.SOLICITUD_LICITACION sl ON l.ID_SOLICITUD = sl.ID_SOLICITUD
            INNER JOIN 
                dbo.CATEGORIA_PRODUCTO cp ON sl.ID_CATEGORIA = cp.ID_CATEGORIA
            INNER JOIN 
                dbo.DEPARTAMENTO d ON sl.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
            INNER JOIN 
                dbo.PRODUCTO p ON sl.ID_PRODUCTO = p.ID_PRODUCTO
            WHERE 
                l.ESTADO = 'Inactivo'
        `;

        const result = await pool.request().query(query);

        // Verificar si se encontraron resultados
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron licitaciones activas' });
        }

        // Retornar los resultados
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error al buscar licitaciones activas:', err);
        res.status(500).json({ message: 'Error en la base de datos al buscar licitaciones' });
    }
};





