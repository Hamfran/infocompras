const express = require('express');
const router = express.Router();
const selectGuatemalaController= require('../controller/SelectGuatemalaController');



router.get('/verdepartamentos', selectGuatemalaController.verTodosDepartamentos);

// Ruta para ver un departamento específico por ID
router.get('/verdepartamento/:id', selectGuatemalaController.verDepartamentoPorId);
module.exports = router;