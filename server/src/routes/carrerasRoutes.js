const express = require('express');
const router = express.Router();
const carrerasController = require('../controller/carrerasController.js');

// Endpoints del CRUD de Carreras
router.get('/', carrerasController.obtenerCarreras);
router.get('/:id', carrerasController.obtenerCarreraPorId);
router.post('/', carrerasController.crearCarrera);
router.put('/:id', carrerasController.actualizarCarrera);
router.delete('/:id', carrerasController.eliminarCarrera);

module.exports = router;