const express = require('express');
const router = express.Router();
const selectGuatemalaController= require('../controller/SelectGuatemalaController');



router.get('/Buscardepa/verdepartamentos', selectGuatemalaController.verTodosDepartamentos);

// Ruta para ver un departamento específico por ID
router.get('Buscardepa/verdepartamento/:id', selectGuatemalaController.verDepartamentoPorId);
module.exports = router;