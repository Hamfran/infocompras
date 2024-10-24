const express = require('express');
const router = express.Router();
const EstadisticaController = require('../controller/EstadisticaController');
router.get('/adjuporidfecha',EstadisticaController.obtenerAdjudicacionesPorFecha)

router.get('/generarinforme', EstadisticaController.generarInformeEstadisticas)
router.get('/consumopordepa', EstadisticaController.obtenerConsumoPorDepartamento)
router.get('/productosmasvendidos', EstadisticaController.obtenerProductosMasVendidos)
router.get('/topdevendedores', EstadisticaController.obtenerTopProveedores)



module.exports = router;