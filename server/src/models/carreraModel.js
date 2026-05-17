const db = require('../config/db.js');

const CarreraModel = {
   // Obtener todas las carreras
   getAll: (callback) => {
      const sql = 'SELECT * FROM carreras';
      db.query(sql, callback);
   },

   // Obtener una carrera por su ID 
   getById: (id, callback) => {
      const sql = 'SELECT * FROM carreras WHERE id = ?';
      db.query(sql, [id], callback);
   },

   // Crear una nueva carrera
   create: (nombre, callback) => {
      const sql = 'INSERT INTO carreras (nombre) VALUES (?)';
      db.query(sql, [nombre], callback);
   },

   // Actualizar una carrera
   update: (id, nombre, callback) => {
      const sql = 'UPDATE carreras SET nombre = ? WHERE id = ?';
      db.query(sql, [nombre, id], callback);
   },

   // Eliminar una carrera
   delete: (id, callback) => {
      const sql = 'DELETE FROM carreras WHERE id = ?';
      db.query(sql, [id], callback);
   }
};

module.exports = CarreraModel;