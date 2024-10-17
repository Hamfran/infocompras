const { poolPromise,sql } = require('../config/conexionBD');

exports.generarsoli = async (req, res) => {
    const { ID_USUARIO, ID_CATEGORIA, CANTIDAD, MONTO_TOTAL, ID_DEPARTAMENTO, ESTADO, ID_PRODUCTO, DESCRIPCION } = req.body;
    //tiene que llenar todo los datos porque no se aceptan nulos
    
    try {
        const query = `
            INSERT INTO SOLICITUD_LICITACION (ID_USUARIO, ID_CATEGORIA, CANTIDAD, MONTO_TOTAL, ID_DEPARTAMENTO, ESTADO, ID_PRODUCTO, DESCRIPCION)
             VALUES (@ID_USUARIO, @ID_CATEGORIA, @CANTIDAD, @MONTO_TOTAL, @ID_DEPARTAMENTO, @ESTADO, @ID_PRODUCTO, @DESCRIPCION)`;
            if (!ID_USUARIO || !ID_CATEGORIA || !CANTIDAD || !MONTO_TOTAL ||!ID_DEPARTAMENTO ||!ID_DEPARTAMENTO ||!ESTADO  ||!ID_PRODUCTO||!ID_PRODUCTO  === undefined) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }
        // Realizar la inserciónID_PRODUCTO
        const pool = await poolPromise;
        await pool.request()
            .input('ID_USUARIO', sql.Int, ID_USUARIO)
            .input('ID_CATEGORIA', sql.Int, ID_CATEGORIA)
            .input('CANTIDAD', sql.Int, CANTIDAD)
            .input('MONTO_TOTAL', sql.Decimal, MONTO_TOTAL)
            .input('ID_DEPARTAMENTO', sql.Int, ID_DEPARTAMENTO)
            .input('ESTADO', sql.VarChar, ESTADO)
            .input('ID_PRODUCTO', sql.Int, ID_PRODUCTO)
            .input('DESCRIPCION', sql.VarChar, DESCRIPCION)
            .query(query);

        // Enviar respuesta de éxito
        res.status(201).json({ message: 'SOLICITUD REGISTRADA CORRECTAMENTE' });

    } catch (err) {
        console.error('Error al registrar proveedor:', err);
        if (err.code === 'ER_DUP_ENTRY') { // Cambia esto según el error específico que SQL Server devuelva
            return res.status(409).json({ message: 'proveedor ya existe' });
        }
        res.status(500).json({ message: 'Error en la base de datos al generar solicitud' });
    }
};

exports.versolicitudes = async(req, res)=>{
     try {
        const query =`
        SELECT * FROM SOLICITUD_LICITACION 
        `;
        
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);

     } catch (error) {

        console.error('Error al cargar solcitudes', error);
        res.status(500).json({message: 'Error en la base de datos al consumir solcitudes'});
        
        
     }


}