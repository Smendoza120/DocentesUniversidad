const db = require('../config/db.js'); 

const DocenteModel = {
   getAll: (callback) => {
      const sql = 'SELECT * FROM docentes';
      db.query(sql, callback);
   },

   getById: (id, callback) => {
      const sql = 'SELECT * FROM docentes WHERE id = ?';
      db.query(sql, [id], callback);
   },

   create: (data, callback) => {
      const sql = 'INSERT INTO docentes (nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia) VALUES (?,?,?,?,?,?,?)';
      db.query(sql, [
         data.nombre, 
         data.correo, 
         data.telefono, 
         data.titulo, 
         data.area_academica, 
         data.dedicacion, 
         data.anios_experiencia
      ], callback);
   },

   update: (id, data, callback) => {
      const sql = 'UPDATE docentes SET nombre=?, correo=?, telefono=?, titulo=?, area_academica=?, dedicacion=?, anios_experiencia=? WHERE id=?';
      db.query(sql, [
         data.nombre, 
         data.correo, 
         data.telefono, 
         data.titulo, 
         data.area_academica, 
         data.dedicacion, 
         data.anios_experiencia, 
         id
      ], callback);
   },

   delete: (id, callback) => {
      const sql = 'DELETE FROM docentes WHERE id=?';
      db.query(sql, [id], callback);
   }
};

module.exports = DocenteModel;