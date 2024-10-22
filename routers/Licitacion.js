const express = require('express');
const router = express.Router();
const licitacionController = require('../controller/LicitacionController');

// Ruta para insertar una nueva licitación
router.post('/insertLicitacion', licitacionController.insertLicitacion);

// Ruta para actualizar una licitación existente
router.put('/actualizarlicitacion/:id', licitacionController.updateLicitacion);
router.get('/buscarLicitacion/:id',licitacionController.getLicitacion);
router.get('/getFechaSolicitud/:id',licitacionController.getFechaSolicitud);


module.exports = router;
