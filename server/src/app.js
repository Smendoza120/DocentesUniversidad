const express = require('express');
const cors = require('cors');
const docentesRoutes = require('./routes/docentesRoutes.js');
const estudiantesRoutes = require('./routes/estudiantesRoutes.js');
const carrerasRoutes = require('./routes/carrerasRoutes.js');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Registro de rutas unificadas
app.use('/docentes', docentesRoutes);
app.use('/estudiantes', estudiantesRoutes);
app.use('/carreras', carrerasRoutes);

module.exports = app;