const express = require('express');
const router = express.Router();
const docentesController = require('../controller/docentesController.js');

// Definición de endpoints
router.get('/', docentesController.obtenerDocentes);
router.get('/:id', docentesController.obtenerDocentePorId);
router.post('/', docentesController.crearDocente);
router.put('/:id', docentesController.actualizarDocente);
router.delete('/:id', docentesController.eliminarDocente);

module.exports = router;