const express = require('express');
const router = express.Router();
const departamentosController = require('../controller/DepartamentosController'); // Asegúrate de que la ruta sea correcta

// Ruta para obtener todos los departamentos
router.get('/', departamentosController.getDepartamentos);

module.exports = router;
