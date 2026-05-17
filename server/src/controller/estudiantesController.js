const EstudianteModel = require('../models/estudianteModel.js');

exports.obtenerEstudiantes = (req, res) => {
  EstudianteModel.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
    res.json(results);
  });
};

exports.crearEstudiante = (req, res) => {
  const { nombre, correo, carrera_id } = req.body;

  // Validaciones básicas
  if (!nombre?.trim() || !correo?.trim() || !carrera_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos (nombre, correo, carrera_id)' });
  }

  const datosEstudiante = {
    nombre: nombre.trim(),
    correo: correo.trim(),
    carrera_id: Number(carrera_id)
  };

  EstudianteModel.create(datosEstudiante, (err, result) => {
    if (err) {
      // Si el correo ya existe (Constraint UNIQUE)
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El correo ya se encuentra registrado' });
      }
      return res.status(500).json({ error: 'Error al guardar el estudiante' });
    }
    res.status(201).json({ id: result.insertId, ...datosEstudiante });
  });
};

exports.obtenerEstudiantePorId = (req, res) => {
  const { id } = req.params;

  EstudianteModel.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el estudiante' });
    }
    if (!results.length) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(results[0]);
  });
};

exports.actualizarEstudiante = (req, res) => {
  const { id } = req.params;
  const { nombre, correo, carrera_id } = req.body;

  // Validar que los campos de texto no vengan vacíos
  if (!nombre?.trim() || !correo?.trim() || !carrera_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos y no deben estar vacíos' });
  }

  const datosActualizados = {
    nombre: nombre.trim(),
    correo: correo.trim(),
    carrera_id: Number(carrera_id)
  };

  EstudianteModel.update(id, datosActualizados, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El correo ya está siendo usado por otro estudiante' });
      }
      return res.status(500).json({ error: 'Error al actualizar el estudiante' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el estudiante con el ID proporcionado' });
    }

    return res.json({ message: 'Estudiante actualizado correctamente' });
  });
};

exports.eliminarEstudiante = (req, res) => {
  const { id } = req.params;

  EstudianteModel.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el estudiante' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el estudiante a eliminar' });
    }

    return res.json({ message: 'Estudiante eliminado correctamente' });
  });
};