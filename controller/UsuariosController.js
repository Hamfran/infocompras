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
    const { nombre, apellido, telefono, direccion, contrasena, id_rol } = req.body;

    // Verificar que todos los campos necesarios estén presentes
    if (!nombre || !apellido || !telefono || !direccion || !contrasena || id_rol === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10); // Usar await para la versión asíncrona

        // Preparar la consulta de inserción
        const query = `
            INSERT INTO USUARIOS (NOMBRE, PASWORD, ID_ROL, APELLIDO, TELEFONO, DIRECCION)
            VALUES (@nombre, @pasword, @id_rol, @apellido, @telefono, @direccion)`;

        // Realizar la inserción
        const pool = await poolPromise; // Usa poolPromise para la conexión
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
        // Manejo de errores específico
        if (err.code === 'ER_DUP_ENTRY') { // Cambia esto según el error específico que SQL Server devuelva
            return res.status(409).json({ message: 'El usuario ya existe' });
        }
        res.status(500).json({ message: 'Error en la base de datos al registrar usuario' });
    }
};
