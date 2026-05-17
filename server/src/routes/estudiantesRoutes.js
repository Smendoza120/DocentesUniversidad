const express = require('express');
const router = express.Router();
const estudiantesController = require('../controller/estudiantesController.js');

router.get('/', estudiantesController.obtenerEstudiantes);
router.get('/:id', estudiantesController.obtenerEstudiantePorId);
router.post('/', estudiantesController.crearEstudiante);
router.put('/:id', estudiantesController.actualizarEstudiante);
router.delete('/:id', estudiantesController.eliminarEstudiante);

module.exports = router;