const express = require('express');
const router = express.Router();
const clienteController= require('../controller/UsuariosController');

// Ruta para iniciar sesión
router.post('/login', clienteController.login)

// Ruta para registrar un nuevo usuario 
router.post('/register', clienteController.register)

module.exports = router;
