const express = require('express');
const router = express.Router();
const GenerasolicitudController= require('../controller/GenerarSolicitud');

// Ruta para iniciar sesión
router.post('/generarsolicitud', GenerasolicitudController.generarsoli)

// Ruta para registrar un nuevo usuario 
router.get('/versolicitud', GenerasolicitudController.versolicitudes)

module.exports = router;
