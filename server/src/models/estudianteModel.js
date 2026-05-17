const db = require('../config/db.js');

const EstudianteModel = {
  getAll: (callback) => {
      const sql = `
         SELECT e.*, c.nombre AS carrera_nombre 
         FROM estudiantes e
         LEFT JOIN carreras c ON e.carrera_id = c.id
      `;
      db.query(sql, callback);
   },

   create: (data, callback) => {
      const sql = 'INSERT INTO estudiantes (nombre, correo, carrera_id) VALUES (?, ?, ?)';
      db.query(sql, [data.nombre, data.correo, data.carrera_id], callback);
   },

   getById: (id, callback) => {
      const sql = `
         SELECT e.*, c.nombre AS carrera_nombre 
         FROM estudiantes e
         LEFT JOIN carreras c ON e.carrera_id = c.id
         WHERE e.id = ?
      `;
      db.query(sql, [id], callback);
   },

   update: (id, data, callback) => {
      const sql = 'UPDATE estudiantes SET nombre=?, correo=?, carrera_id=? WHERE id=?';
      db.query(sql, [data.nombre, data.correo, data.carrera_id, id], callback);
   },

   delete: (id, callback) => {
      const sql = 'DELETE FROM estudiantes WHERE id=?';
      db.query(sql, [id], callback);
   }
};

module.exports = EstudianteModel;