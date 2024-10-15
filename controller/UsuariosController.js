const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const { poolPromise,sql } = require('../config/conexionBD'); // Importar poolPromise para realizar consultas

// Iniciar sesión
exports.login = async (req, res) => {
    const { nombre, contrasena } = req.body;

    try {
        const pool = await poolPromise; // Espera a que la conexión esté lista
        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre) // Parámetros
            .query('SELECT * FROM USUARIOS WHERE NOMBRE = @nombre'); // Usamos @nombre para evitar SQL Injection

        const users = result.recordset; // Obtiene el conjunto de resultados

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
        const passwordIsValid = bcrypt.compareSync(contrasena, user.PASWORD); // Compara contraseñas

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Si todo está bien, retornamos el usuario
        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    } catch (err) {
        console.error('Error en la base de datos:', err);
        res.status(500).json({ message: 'Error en la base de datos' });
    }
};

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { nombre, apellido, contrasena, rol, telefono, direccion } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10); // Encriptar contraseña

        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('hashedPassword', sql.VarChar, hashedPassword)
            .input('rol', sql.Int, rol)
            .input('telefono', sql.VarChar, telefono)
            .input('direccion', sql.VarChar, direccion)
            .query('INSERT INTO USUARIOS (NOMBRE, APELLIDO, PASWORD, ID_ROL, TELEFONO, DIRECCION) VALUES (@nombre, @apellido, @hashedPassword, @rol, @telefono, @direccion)');

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error('Error en la base de datos:', err);
        res.status(500).json({ message: 'Error en la base de datos' });
    }
};
