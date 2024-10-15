const express = require('express');
const router = express.Router();
const proveedorController= require('../controller/proveedorController');

// Ruta para iniciar sesión

// Ruta para registrar un nuevo usuario 
router.post('/proveedor', proveedorController.proveedor)

module.exports = router;
