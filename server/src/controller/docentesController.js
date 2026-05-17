const DocenteModel = require('../models/docenteModel.js');

exports.obtenerDocentes = (req, res) => {
   DocenteModel.getAll((err, results) => {
      if (err) {
         return res.status(500).json({ error: 'error al obtener los docentes' });
      }
      if (!results.length) {
         return res.status(404).json({ error: 'Docente no encontrado' });
      }
      res.json(results);
   });
};

exports.obtenerDocentePorId = (req, res) => {
   const { id } = req.params;
   DocenteModel.getById(id, (err, results) => {
      if (err) {
         return res.status(500).json({ error: 'error al obtener el docente' });
      }
      res.json(results[0]);
   });
};

exports.crearDocente = (req, res) => {
   const { nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia } = req.body;
   
   if (!nombre?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() || !anios_experiencia) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
   }

   const anios = Number(anios_experiencia);
   if (Number.isNaN(anios) || anios < 0) {
      return res.status(400).json({ error: 'años de experiencia del docente inválidos' });
   }

   const nuevoDocente = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      titulo: titulo.trim(),
      area_academica: area_academica.trim(),
      dedicacion: dedicacion.trim(),
      anios_experiencia: anios
   };

   DocenteModel.create(nuevoDocente, (err, result) => {
      if (err) {
         return res.status(500).json({ error: 'Error al guardar al docente' });
      }
      res.json({ id: result.insertId, ...nuevoDocente });
   });
};

exports.actualizarDocente = (req, res) => {
   const { id } = req.params;
   const { nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia } = req.body;

   const camposValidos = [nombre, correo, telefono, titulo, area_academica, dedicacion].every(campo => campo?.toString().trim());

   if (!camposValidos || anios_experiencia === undefined) {
      return res.status(400).json({ error: 'Todos los campos son requeridos y no deben estar vacíos' });
   }

   const anios = Number(anios_experiencia);
   if (Number.isNaN(anios) || anios < 0) {
      return res.status(400).json({ error: 'Años de experiencia inválidos' });
   }

   const datosActualizados = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      titulo: titulo.trim(),
      area_academica: area_academica.trim(),
      dedicacion: dedicacion.trim(),
      anios_experiencia: anios
   };

   DocenteModel.update(id, datosActualizados, (err, result) => {
      if (err) {
         return res.status(500).json({ error: 'Error al actualizar el docente' });
      }
      if (result.affectedRows === 0) {
         return res.status(404).json({ error: 'No se encontró el docente con el ID proporcionado' });
      }
      return res.json({ message: 'Docente Actualizado correctamente' });
   });
};

exports.eliminarDocente = (req, res) => {
   const { id } = req.params;

   DocenteModel.delete(id, (err) => {
      if (err) {
         return res.status(500).json({ error: 'Error al eliminar el docente' });
      }
      return res.json({ message: 'Docente Eliminado' });
   });
};