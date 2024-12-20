const express = require('express');
const router = express.Router();
const proveedorController= require('../controller/proveedorController');

// Ruta para registrar un nuevo usuario 
router.post('/registropro', proveedorController.registropro)

router.get('/verproveedores', proveedorController.verprovedor)
router.get('/topdepartamentos', proveedorController.topDepartamentos)
router.get('/topproductos', proveedorController.topproductos)
router.get('/topproveedores', proveedorController.topproveedores)
router.get('/imprimirtopdepartamentos', proveedorController.imprimirtopDepartamentos)
router.get('/imprimir', proveedorController.imprimirProvedores)

module.exports = router;
