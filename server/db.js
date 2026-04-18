require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.BD_HOST || 'localhost',
    user: process.env.BD_USER || 'root',
    password: process.env.BD_PASSWORD || 'admin',
    database: process.env.BD_NAME || 'docentesuniversidad'
});

connection.connect((err) => {
    if (err) {
        console.log(`Error al conectar la base de datos, err, ${err.message}`);
        return;
    }
    console.log('conectado a la base de datos');
});
module.exports = connection;