const express = require('express');
const router = express.Router();
const proveedorController= require('../controller/proveedorController');

// Ruta para registrar un nuevo usuario 
router.post('/registropro', proveedorController.registropro)

router.get('/verproveedores', proveedorController.verprovedor)
router.get('/imprimir', proveedorController.imprimirProvedores)

module.exports = router;
