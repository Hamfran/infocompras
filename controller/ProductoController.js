const { poolPromise,sql } = require('../config/conexionBD');
const PDFDocument = require('pdfkit');

exports.registroproductos = async (req, res) => {
    const { ID_CATEGORIA, NOMBRE_PRODUCTO, DESCRIPCION, PRECIO_UNITARIO } = req.body;

    if (!ID_CATEGORIA || !NOMBRE_PRODUCTO || !DESCRIPCION || !PRECIO_UNITARIO) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    } 

    try {
        const query = `
            INSERT INTO PRODUCTO (ID_CATEGORIA, NOMBRE_PRODUCTO, DESCRIPCION, PRECIO_UNITARIO)
            VALUES (@ID_CATEGORIA, @NOMBRE_PRODUCTO, @DESCRIPCION, @PRECIO_UNITARIO)`;

        const pool = await poolPromise;
        await pool.request()
            .input('ID_CATEGORIA', sql.Int, ID_CATEGORIA) // Confirma que sea un entero
            .input('NOMBRE_PRODUCTO', sql.VarChar, NOMBRE_PRODUCTO)
            .input('DESCRIPCION', sql.VarChar, DESCRIPCION)
            .input('PRECIO_UNITARIO', sql.Int, PRECIO_UNITARIO) // Usa sql.Decimal para el precio unitario si es necesario
            .query(query);

        res.status(201).json({ message: 'PRODUCTO REGISTRADO CORRECTAMENTE' });

    } catch (err) {
        console.error('Error al ingresar producto:', err);
        if (err.code === 'ER_DUP_ENTRY') { // Cambia esto según el error específico que SQL Server devuelva
            return res.status(409).json({ message: 'Producto ya existe' });
        }
        res.status(500).json({ message: 'Error al registrar producto' });
    }
};

exports.verproductos = async(req, res)=>{
     try {
        const query =`
        SELECT * FROM PRODUCTO 
        `;
        
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);

     } catch (error) {

        console.error('Error al cargar productos', error);
        res.status(500).json({message: 'Error en la base de datos al consumir productos'});
        
        
     }

}

exports.imprimirProvedores = async (req, res) => {
    try {
        const query = `
        SELECT TOP (1000) [ID_PRODUCTO], [ID_CATEGORIA], [NOMBRE_PRODUCTO], [DESCRIPCION], [PRECIO_UNITARIO]
        FROM [dbo].[PRODUCTO]
        `;
        
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');
        doc.pipe(res);
        doc.fontSize(18).text('Lista de PRODUCTOS', { align: 'center' });
        doc.moveDown(); // Espacio después del título

        // Iterar sobre los registros obtenidos de la base de datos
        result.recordset.forEach(productos => {
            doc.fontSize(12).text(`ID: ${productos.ID_PROVEEDOR}`);
            doc.text(`Categoria: ${productos.ID_CATEGORIA}`);
            doc.text(`NombreProducto: ${productos.NOMBRE_PRODUCTO}`);
            doc.text(`Descripcion: ${productos.DESCRIPCION}`);
            doc.text(`PrecioUnitario: ${productos.PRECIO_UNITARIO}`);
            doc.moveDown(); // Espacio entre registros
        });

        // Finalizar el documento
        doc.end();
        
    } catch (error) {
        console.error('Error al cargar productos', error);
        res.status(500).json({ message: 'Error en la base de datos al consumir productos' });
    }
};