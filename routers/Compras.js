const express = require('express');
const router = express.Router();
const ComprasController = require('../controller/CompraCOntroller');

// Ruta para insertar una nueva compra
router.post('/insertCompra', ComprasController.insertCompra);
router.get('/buscarcompras', ComprasController.buscarLicitacionesActivas);
router.get('/buscarcomprasInactivas', ComprasController.buscarLicitacionesInactivas);


module.exports = router;
