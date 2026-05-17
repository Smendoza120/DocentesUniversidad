const CarreraModel = require('../models/carreraModel.js');

exports.obtenerCarreras = (req, res) => {
   CarreraModel.getAll((err, results) => {
      if (err) {
         return res.status(500).json({ error: 'Error al obtener las carreras' });
      }
      res.json(results);
   });
};

exports.obtenerCarreraPorId = (req, res) => {
   const { id } = req.params;
   CarreraModel.getById(id, (err, results) => {
      if (err) {
         return res.status(500).json({ error: 'Error al obtener la carrera' });
      }
      if (!results.length) {
         return res.status(404).json({ error: 'Carrera no encontrada' });
      }
      res.json(results[0]);
   });
};

exports.crearCarrera = (req, res) => {
   const { nombre } = req.body;

   if (!nombre?.trim()) {
      return res.status(400).json({ error: 'El nombre de la carrera es requerido' });
   }

   CarreraModel.create(nombre.trim(), (err, result) => {
      if (err) {
         return res.status(500).json({ error: 'Error al guardar la carrera' });
      }
      res.status(201).json({ id: result.insertId, nombre: nombre.trim() });
   });
};

exports.actualizarCarrera = (req, res) => {
   const { id } = req.params;
   const { nombre } = req.body;

   if (!nombre?.trim()) {
      return res.status(400).json({ error: 'El nombre de la carrera es requerido' });
   }

   CarreraModel.update(id, nombre.trim(), (err, result) => {
      if (err) {
         return res.status(500).json({ error: 'Error al actualizar la carrera' });
      }
      if (result.affectedRows === 0) {
         return res.status(404).json({ error: 'No se encontró la carrera con el ID proporcionado' });
      }
      res.json({ message: 'Carrera actualizada correctamente' });
   });
};

exports.eliminarCarrera = (req, res) => {
   const { id } = req.params;

   CarreraModel.delete(id, (err, result) => {
      if (err) {
         // Capturar si se intenta borrar una carrera que ya tiene estudiantes asignados
         if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(400).json({ error: 'No se puede eliminar la carrera porque tiene estudiantes asociados' });
         }
         return res.status(500).json({ error: 'Error al eliminar la carrera' });
      }
      if (result.affectedRows === 0) {
         return res.status(404).json({ error: 'No se encontró la carrera a eliminar' });
      }
      res.json({ message: 'Carrera eliminada correctamente' });
   });
};