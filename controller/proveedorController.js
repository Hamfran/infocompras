const { poolPromise,sql } = require('../config/conexionBD');
const PDFDocument = require('pdfkit');


/** se llama registroproveedor y registraremos un proveedor
 * menos su codigo porque ese se lo da la base de datos
 */
exports.registropro = async (req, res) => {
    const { nombre, contacto, nit, correo } = req.body;
    //tiene que llenar todo los datos porque no se aceptan nulos
    if (!nombre || !contacto || !nit || !correo === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const query = `
            INSERT INTO PROVEEDOR (NOMBRE, CONTACTO, NIT, CORREO)
            VALUES (@nombre, @contacto, @nit, @correo)`;

        // Realizar la inserción
        const pool = await poolPromise;
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
        if (err.code === 'ER_DUP_ENTRY') { // Cambia esto según el error específico que SQL Server devuelva
            return res.status(409).json({ message: 'proveedor ya existe' });
        }
        res.status(500).json({ message: 'Error en la base de datos al registrar Proveedor' });
    }
};

exports.verprovedor = async(req, res)=>{
     try {
        const query =`
        SELECT * FROM PROVEEDOR 
        `;
        
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);

     } catch (error) {

        console.error('Error al cargar proveedores', error);
        res.status(500).json({message: 'Error en la base de datos al consumir proveedores'});
        
        
     }

}
exports.topDepartamentos = async(req, res)=>{
    try {
       const query =`
        SELECT 
        m.ID_DEPARTAMENTO,
        d.NOMBRE as nombre_departamento,
        COUNT(dist.ID_DISTRIBUCION) as total_adjudicaciones
        FROM 
        MUNICIPIOS m
        INNER JOIN DEPARTAMENTO d ON m.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
        INNER JOIN DISTRIBUCION dist ON m.ID_MUNICIPIO = dist.ID_MUNICIPIO
        GROUP BY 
        m.ID_DEPARTAMENTO,
        d.NOMBRE
        ORDER BY 
        total_adjudicaciones DESC;
       `;
       
       const pool = await poolPromise;
       const result = await pool.request().query(query);
       res.status(200).json(result.recordset);

    } catch (error) {

       console.error('Error al cargar Top Departamentos', error);
       res.status(500).json({message: 'Error en la base de datos top departamentos'});
       
       
    }

}

exports.topproductos = async(req, res)=>{
    try {
       const query =`
        SELECT 
        p.ID_PRODUCTO,
        p.NOMBRE_PRODUCTO,
        SUM(d.CANTIDAD) as cantidad_total,
        COUNT(d.ID_DISTRIBUCION) as veces_distribuido
        FROM 
        PRODUCTO p
        INNER JOIN DISTRIBUCION d ON p.ID_PRODUCTO = d.ID_PRODUCTO
        GROUP BY 
        p.ID_PRODUCTO,
        p.NOMBRE_PRODUCTO
        ORDER BY 
        cantidad_total DESC;
        `;
       
       const pool = await poolPromise;
       const result = await pool.request().query(query);
       res.status(200).json(result.recordset);

    } catch (error) {

       console.error('Error al cargar Top productos', error);
       res.status(500).json({message: 'Error en la base de datos top productos'});
       
       
    }

}

exports.topproveedores = async(req, res)=>{
    try {
       const query =`
        SELECT 
        p.ID_PROVEEDOR,
        p.NOMBRE as nombre_proveedor,
        COUNT(a.ID_ADJUDICACION) as total_adjudicaciones,
        SUM(a.MONTO_TOTAL) as monto_total_adjudicado
        FROM 
        PROVEEDOR p
        INNER JOIN ADJUDICACION a ON p.ID_PROVEEDOR = a.ID_PROVEEDOR
        GROUP BY 
        p.ID_PROVEEDOR,
        p.NOMBRE
        ORDER BY 
        total_adjudicaciones DESC;
       `;
       
       const pool = await poolPromise;
       const result = await pool.request().query(query);
       res.status(200).json(result.recordset);

    } catch (error) {

       console.error('Error al cargar Top proveedores', error);
       res.status(500).json({message: 'Error en la base de datos top proveedores'});
       
       
    }

}

exports.imprimirtopDepartamentos = async (req, res) => {
    try {
        const query = `
        SELECT TOP (1000) [ID_DEPARTAMENTO], [nombre_departamento], [total_adjudicaciones]
        FROM [dbo].[MUNICIPIOS]
        `;
        
        const pool = await poolPromise;
        const result = await pool.request().query(query);

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Configurar encabezado de la respuesta para que sea un PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=departamentos.pdf');

        // Enviar el PDF al cliente directamente
        doc.pipe(res);

        // Añadir contenido al PDF
        doc.fontSize(18).text('Top de Departamentos', { align: 'center' });
        doc.moveDown(); // Espacio después del título

        // Iterar sobre los registros obtenidos de la base de datos
        result.recordset.forEach(departamentos => {
            doc.fontSize(12).text(`ID: ${departamentos.ID_DEPARTAMENTO}`);
            doc.text(`Nombre: ${departamentos.nombre_departamento}`);
            doc.text(`Contacto: ${departamentos.total_adjudicaciones}`);
            doc.moveDown(); // Espacio entre registros
        });

        // Finalizar el documento
        doc.end();
        
    } catch (error) {
        console.error('Error al cargar top departamentos', error);
        res.status(500).json({ message: 'Error en la base de datos top departamentos' });
    }
};


exports.imprimirProvedores = async (req, res) => {
    try {
        const query = `
        SELECT TOP (1000) [ID_PROVEEDOR], [NOMBRE], [CONTACTO], [NIT], [CORREO]
        FROM [dbo].[PROVEEDOR]
        `;
        
        const pool = await poolPromise;
        const result = await pool.request().query(query);

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Configurar encabezado de la respuesta para que sea un PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=proveedores.pdf');

        // Enviar el PDF al cliente directamente
        doc.pipe(res);

        // Añadir contenido al PDF
        doc.fontSize(18).text('Lista de Proveedores', { align: 'center' });
        doc.moveDown(); // Espacio después del título

        // Iterar sobre los registros obtenidos de la base de datos
        result.recordset.forEach(proveedor => {
            doc.fontSize(12).text(`ID: ${proveedor.ID_PROVEEDOR}`);
            doc.text(`Nombre: ${proveedor.NOMBRE}`);
            doc.text(`Contacto: ${proveedor.CONTACTO}`);
            doc.text(`NIT: ${proveedor.NIT}`);
            doc.text(`Correo: ${proveedor.CORREO}`);
            doc.moveDown(); // Espacio entre registros
        });

        // Finalizar el documento
        doc.end();
        
    } catch (error) {
        console.error('Error al cargar proveedores', error);
        res.status(500).json({ message: 'Error en la base de datos al consumir proveedores' });
    }
};