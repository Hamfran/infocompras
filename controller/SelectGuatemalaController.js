
const { poolPromise,sql } = require('../config/conexionBD');



exports.verDepartamentoPorId = async (req, res) => {
    try {
        const {id} = req.params; // Asume que el ID se pasa como parámetro en la URL

        // Validación básica del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'ID de departamento inválido' });
        }

        const query = `
            SELECT * FROM DEPARTAMENTO 
            WHERE ID_DEPARTAMENTO = @id
        `;
        
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', pool.sql.Int, parseInt(id))
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Departamento no encontrado' });
        }

        res.status(200).json(result.recordset[0]);

    } catch (error) {
        console.error('Error al cargar departamento', error);
        res.status(500).json({ message: 'Error en la base de datos al buscar el departamento' });
    }
};

exports.verTodosDepartamentos = async (req, res) => {
    try {
        const query = `
            SELECT * FROM DEPARTAMENTO 
        `;
        
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error('Error al cargar departamentos', error);
        res.status(500).json({ message: 'Error en la base de datos al consumir departamentos' });
    }
};
