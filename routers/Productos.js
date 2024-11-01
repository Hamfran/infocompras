const express = require('express');
const router = express.Router();
const ProductosController= require('../controller/ProductoController');


router.post('/registroproductos', ProductosController.registroproductos)
router.get('/verproductos', ProductosController.verproductos )
router.get('/imprimirproductos', ProductosController.imprimirProvedores)

module.exports= router;

