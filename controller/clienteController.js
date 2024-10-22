const sql = require('mssql');
const  conexionBD= require('../config/conexionBD'); // Asegúrate de tener conexión a la base de datos
const bcrypt = require('bcrypt');   // Para encriptar contraseñas


exports.register = async (req, res) => {
    const { nombre, apellido, telefono, direccion, contrasena, id_rol } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = bcrypt.hashSync(contrasena, 10);

        // Preparar la consulta de inserción
        const query = `
            INSERT INTO USUARIOS (NOMBRE, PASWORD, ID_ROL, APELLIDO, TELEFONO, DIRECCION)
            VALUES (@nombre, @pasword, @id_rol, @apellido, @telefono, @direccion)`;

        // Realizar la inserción
        const pool = await sql.connect();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('pasword', sql.VarChar, hashedPassword)
            .input('id_rol', sql.Int, id_rol)
            .input('apellido', sql.VarChar, apellido)
            .input('telefono', sql.VarChar, telefono)
            .input('direccion', sql.VarChar, direccion)
            .query(query);

        // Enviar respuesta de éxito
        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ message: 'Error en la base de datos al registrar usuario' });
    }
};