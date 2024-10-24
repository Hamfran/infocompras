const {poolPromise, sql}= require('../config/conexionBD');
const PDFDocument  = require('pdfkit');

/*AQUI ARE LA D OBTERNER MIS VNETAS TOTEALES QEU 
EMPLEARE EN MI VISTA DE ESTADISTICA 
exports.obtenerVentasTotales = async (req, res)=> {*/
exports.obtenerAdjudicacionesPorFecha = async (req, res) => {
    const { idProveedor, fechaInicio, fechaFin, } = req.query;
    try {
        const query = `
            SELECT 
                p.NOMBRE,
                SUM(a.MONTO_TOTAL) as TOTAL_ADJUDICACIONES,
                a.FECHA_ADJUDICACION
            FROM 
                PROVEEDOR p
                INNER JOIN ADJUDICACION a ON p.ID_PROVEEDOR = a.ID_PROVEEDOR
            WHERE 
                p.ID_PROVEEDOR = @idProveedor
                AND a.FECHA_ADJUDICACION BETWEEN @fechaInicio AND @fechaFin
            GROUP BY 
                p.NOMBRE, a.FECHA_ADJUDICACION
            ORDER BY 
                a.FECHA_ADJUDICACION ASC`;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('idProveedor', sql.Int, idProveedor)
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .query(query);
            res.json(result.recordset);

        if (!result.recordset.length) {
            return res.status(200).json({
                message: 'No se encontraron adjudicaciones en el rango de fechas especificado',
                data: []
            });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener ventas totales:', error);
        res.status(500).json({ 
            message: 'Error en la base de datos al obtener ventas totales',
            error: error.message 
        });
    }
};


exports.obtenerTopProveedores = async (req, res) => {
    const { fechaInicio, fechaFin, limite = 5 } = req.query;
    try {
        const query = `
            SELECT TOP (@limite) p.NOMBRE, SUM(v.MONTO_TOTAL) as VENTAS_TOTALES
            FROM VENTAS v
            JOIN PRODUCTOS pr ON v.ID_PRODUCTO = pr.ID_PRODUCTO
            JOIN PROVEEDOR p ON pr.ID_PROVEEDOR = p.ID_PROVEEDOR
            WHERE v.FECHA_VENTA BETWEEN @fechaInicio AND @fechaFin
            GROUP BY p.NOMBRE
            ORDER BY VENTAS_TOTALES DESC`;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .input('limite', sql.Int, limite)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener top proveedores:', error);
        res.status(500).json({ message: 'Error en la base de datos al obtener top proveedores' });
    }
};

exports.obtenerProductosMasVendidos = async (req, res) => {
    const { fechaInicio, fechaFin, limite = 5 } = req.query;
    try {
        const query = `
            SELECT TOP (@limite) p.NOMBRE, SUM(v.CANTIDAD) as CANTIDAD_VENDIDA
            FROM VENTAS v
            JOIN PRODUCTOS p ON v.ID_PRODUCTO = p.ID_PRODUCTO
            WHERE v.FECHA_VENTA BETWEEN @fechaInicio AND @fechaFin
            GROUP BY p.NOMBRE
            ORDER BY CANTIDAD_VENDIDA DESC`;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .input('limite', sql.Int, limite)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({ message: 'Error en la base de datos al obtener productos más vendidos' });
    }
};

exports.obtenerConsumoPorDepartamento = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const query = `
            SELECT d.NOMBRE, SUM(v.MONTO_TOTAL) as CONSUMO_TOTAL
            FROM VENTAS v
            JOIN DEPARTAMENTOS d ON v.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
            WHERE v.FECHA_VENTA BETWEEN @fechaInicio AND @fechaFin
            GROUP BY d.NOMBRE
            ORDER BY CONSUMO_TOTAL DESC`;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener consumo por departamento:', error);
        res.status(500).json({ message: 'Error en la base de datos al obtener consumo por departamento' });
    }
};

exports.generarInformeEstadisticas = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        // Obtener datos para el informe
        const pool = await poolPromise;
        const ventasTotales = await pool.request()
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .query(`SELECT SUM(MONTO_TOTAL) as VENTAS_TOTALES FROM VENTAS WHERE FECHA_VENTA BETWEEN @fechaInicio AND @fechaFin`);

        const topProveedores = await pool.request()
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .query(`
                SELECT TOP 5 p.NOMBRE, SUM(v.MONTO_TOTAL) as VENTAS_TOTALES
                FROM VENTAS v
                JOIN PRODUCTOS pr ON v.ID_PRODUCTO = pr.ID_PRODUCTO
                JOIN PROVEEDOR p ON pr.ID_PROVEEDOR = p.ID_PROVEEDOR
                WHERE v.FECHA_VENTA BETWEEN @fechaInicio AND @fechaFin
                GROUP BY p.NOMBRE
                ORDER BY VENTAS_TOTALES DESC`);

    } catch (error) {
        console.error('Error al generar informe de estadísticas:', error);
        res.status(500).json({ message: 'Error en la base de datos al generar informe de estadísticas' });
    }
};
