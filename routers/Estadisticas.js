const express = require('express');
const router = express.Router();
const EstadisticaController = require('../controller/EstadisticaController');
router.get('/adjuporidfecha',EstadisticaController.obtenerAdjudicacionesPorFecha)
router.get('/solipordepartamento', EstadisticaController.solicitudesdeundepartamento)

router.get('/generarinforme', EstadisticaController.generarInformeEstadisticas)
router.get('/consumopordepa', EstadisticaController.obtenerConsumoPorDepartamento)
router.get('/productosmasvendidos', EstadisticaController.obtenerProductosMasVendidos)

module.exports = router;