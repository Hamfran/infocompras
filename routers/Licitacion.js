const express = require('express');
const router = express.Router();
const licitacionController = require('../controller/LicitacionController');

// Ruta para insertar una nueva licitación
router.post('/insertLicitacion', licitacionController.insertLicitacion);

// Ruta para actualizar una licitación existente
router.put('/actualizarlicitacion', licitacionController.updateLicitacion);

module.exports = router;
