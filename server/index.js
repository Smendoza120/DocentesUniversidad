const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
// get obtener  - post crear - put actualizar - delete eliminar 

app.get('/docentes', (req, res) => {
   const sql = 'SELECT * FROM docentes';

   db.query(sql, (err, results) => {
      if (err) {
         // 500 = error interno del servidor
         return res.status(500).json({ error: 'error al obtener los docentes' });
      }
      if (!results.length) {

         return res.status(404).json({ error: 'Docente no encontrado' });
      }
      // 200 implicito
      res.json(results[0]);
   });
});

app.get('/docentes/:id', (req, res) => {
   const { id } = req.params;
   const sql = 'SELECT * FROM docentes WHERE id = ?';

   // db.query(sql, { id }, (err, results) => {
   db.query(sql, [ id ], (err, results) => {
      if (err) {
         // 500 = error interno del servidor
         return res.status(500).json({ error: 'error al obtener el docentes' });
      }
      // 200 implicito
      res.json(results);
   });
});

app.post('/docente', (req, res) => {
   const { nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia } = req.body;
   if (!nombre?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() || !anios_experiencia?.trim()) {

      return res.status(400).json({ error: 'Todos los campos son requeridos' });
   }

   const anios = Number(anios_experiencia);

   if (Number.isNaN(anios) || anios < 0) {

      return res.status(400).json({ error: 'anios de experiencia invalidos' });
   }

   const sql = 'INSERT INTO docentes (nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia) VALUES (?,?,?,?,?,?,?)';

   db.query(sql, [nombre.trim(), correo.trim(), telefono.trim(), titulo.trim(), area_academica.trim(), dedicacion.trim(), anios], (err, result) => {

      if (err) {
         return res.status(500).json({ error: 'Error al guardar al docente' });
      }

      res.json({
         id: result.insertId,
         nombre: nombre.trim(),
         correo: correo.trim(),
         telefono: telefono.trim(),
         titulo: titulo.trim(),
         area_academica: area_academica.trim(),
         dedicacion: dedicacion.trim(),
         anios_experiencia: anios
      });
   });
});

app.put('/docentes/:id', (req, res) => {
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

   const sql = 'UPDATE docentes SET nombre=?, correo=?, telefono=?, titulo=?, area_academica=?, dedicacion=?, anios_experiencia=? WHERE id=? ';

   db.query(sql, [nombre.trim(), correo.trim(), telefono.trim(), titulo.trim(), area_academica.trim(), dedicacion.trim(), anios, id], (err, result) => {
      if (err) {
         return res.status(500).json({ error: 'Error al actualizar el docente' });
      }

      if (result.affectedRows === 0) {
         return res.status(404).json({ error: 'No se encontró el docente con el ID proporcionado' });
      }

      return res.json({ message: 'Docente Actualizado correctamente' });
   });
});

app.delete('/docentes/:id', (req, res) => {
   const { id } = req.params;

   const sql = 'DELETE FROM docentes WHERE id=? ';

   db.query(sql, [id], (err) => {

      if (err) {
         return res.status(500).json({ error: 'Error al eliminar el docente' });
      }

      return res.json({ message: 'Docente Eliminado' });
   });
});

app.listen(3001, () => {
   console.log('servidor backend corriendo desde el puerto 3001 ')
});

