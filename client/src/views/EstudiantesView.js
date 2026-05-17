import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EstudiantesView() {
  // Campos para las consultas
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [carreraId, setCarreraId] = useState('');

  // Listas de datos
  const [registros, setRegistros] = useState([]); // Estudiantes
  const [carreras, setCarreras] = useState([]);   // Catálogo de carreras para el Dropdown
  const [editIndex, setEditIndex] = useState(null);

  // Dialogos
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [indexAEliminar, setIndexAEliminar] = useState(null);

  // Notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [resEstudiantes, resCarreras] = await Promise.all([
        fetch('http://localhost:3001/estudiantes'),
        fetch('http://localhost:3001/carreras')
      ]);

      const dataEstudiantes = await resEstudiantes.json();
      const dataCarreras = await resCarreras.json();

      setRegistros(Array.isArray(dataEstudiantes) ? dataEstudiantes : []);
      setCarreras(Array.isArray(dataCarreras) ? dataCarreras : []);
    } catch (error) {
      showNotification('Error al sincronizar los datos con el servidor', 'error');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setCarreraId('');
  };

  const handleAbrirCrear = () => {
    setEditIndex(null);
    limpiarFormulario();
    setOpenModal(true);
  };

  const handleCerrarModal = () => {
    setOpenModal(false);
    limpiarFormulario();
    setEditIndex(null);
  };

  // POST / PUT: Guardar o Actualizar Estudiante
  const registrarDatos = async (e) => {
    e.preventDefault();

    // Sincronizado con tus validaciones del Backend
    if (!nombre.trim() || !correo.trim() || !carreraId) {
      showNotification('Todos los campos son requeridos (nombre, correo, carrera_id)', 'error');
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      carrera_id: Number(carreraId)
    };

    if (editIndex !== null) {
      // MODO EDICIÓN (PUT a /estudiantes/:id)
      try {
        const estudiante = registros[editIndex];
        const response = await fetch(`http://localhost:3001/estudiantes/${estudiante.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Error ${response.status}`);
        }

        // Para evitar recargar la página entera, mapeamos el nombre de la carrera seleccionado localmente
        const carreraSeleccionada = carreras.find(c => c.id === payload.carrera_id);
        const nuevosRegistros = [...registros];
        nuevosRegistros[editIndex] = {
          ...estudiante,
          ...payload,
          carrera_nombre: carreraSeleccionada ? carreraSeleccionada.nombre : ''
        };

        setRegistros(nuevosRegistros);
        handleCerrarModal();
        showNotification('Estudiante actualizado correctamente', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    } else {
      // MODO CREACIÓN (POST a /estudiantes)
      try {
        const response = await fetch('http://localhost:3001/estudiantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          // Maneja el error ER_DUP_ENTRY que envías desde el controller
          throw new Error(errData.error || 'Error al guardar el estudiante');
        }

        const data = await response.json(); // Retorna { id: result.insertId, ...datosEstudiante }

        // Sincronizar el nombre visible de la carrera para la tabla
        const carreraSeleccionada = carreras.find(c => c.id === payload.carrera_id);
        const nuevoEstudianteCompleto = {
          ...data,
          carrera_nombre: carreraSeleccionada ? carreraSeleccionada.nombre : ''
        };

        setRegistros(prev => [...prev, nuevoEstudianteCompleto]);
        handleCerrarModal();
        showNotification('Estudiante registrado correctamente', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  // DELETE: Eliminar Estudiante de forma directa
  const eliminarRegistro = async (idx) => {
    const estudiante = registros[idx];
    try {
      const response = await fetch(`http://localhost:3001/estudiantes/${estudiante.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        showNotification('Estudiante eliminado correctamente', 'success');
      } else {
        const data = await response.json().catch(() => ({}));
        showNotification(data.error || 'No se pudo eliminar el estudiante', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión al eliminar', 'error');
    }
  };

  const editarRegistro = (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setCorreo(reg.correo);
    setCarreraId(reg.carrera_id); // Almacena el ID numérico para que haga match con el Select
    setEditIndex(idx);
    setOpenModal(true);
  };

  const handleSolicitarEliminacion = (idx) => {
    setIndexAEliminar(idx);
    setOpenConfirmModal(true);
  };

  const handleCancelarEliminacion = () => {
    setOpenConfirmModal(false);
    setIndexAEliminar(null);
  };

  const handleConfirmarEliminacion = async () => {
    if (indexAEliminar !== null) {
      await eliminarRegistro(indexAEliminar);
      setOpenConfirmModal(false);
      setIndexAEliminar(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Gestión de Estudiantes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Registro, control de matrículas y asignación de programas académicos
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAbrirCrear}
          sx={{ fontWeight: 'bold', height: '48px' }}
        >
          Registrar Estudiante
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '12px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de estudiantes">
          <TableHead sx={{ backgroundColor: '#3b4251' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', width: '10%' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Nombre Completo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Correo Institucional</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Carrera</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', width: '15%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No hay estudiantes registrados en el sistema actualmente.
                </TableCell>
              </TableRow>
            ) : (
              registros.map((reg, idx) => (
                <TableRow key={reg.id ?? idx} hover>
                  <TableCell>{reg.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{reg.nombre}</TableCell>
                  <TableCell>{reg.correo}</TableCell>
                  <TableCell>
                    {/* Muestra el alias que nos trae tu LEFT JOIN */}
                    {reg.carrera_nombre || <Typography variant="caption" color="error">Sin Carrera Asignada</Typography>}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton color="primary" onClick={() => editarRegistro(idx)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleSolicitarEliminacion(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogo de eliminación */}
      <Dialog open={openConfirmModal} onClose={handleCancelarEliminacion} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <DeleteIcon color="error" /> ¿Retirar Estudiante?
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar al estudiante: <strong>{indexAEliminar !== null ? registros[indexAEliminar]?.nombre : ''}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción limpiará de inmediato su matrícula y su récord en el sistema de manera permanente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancelarEliminacion}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmarEliminacion} sx={{ fontWeight: 'bold' }}>
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de edición/creación */}
      <Dialog open={openModal} onClose={handleCerrarModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: editIndex !== null ? 'warning.main' : 'primary.main' }}>
          {editIndex !== null ? 'Modificar Datos del Estudiante' : 'Inscribir Nuevo Estudiante'}
        </DialogTitle>

        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box component="form" noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Nombre Completo"
              variant="outlined"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Pérez"
              autoFocus
            />

            <TextField
              label="Correo Electrónico"
              type="email"
              variant="outlined"
              fullWidth
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="juan.perez@university.com"
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel id="select-carrera-label">Carrera a cursar</InputLabel>
              <Select
                labelId="select-carrera-label"
                id="select-carrera"
                value={carreraId}
                onChange={(e) => setCarreraId(e.target.value)}
                label="Carrera a cursar"
              >
                {crawlingCarrerasVigentes(carreras)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleCerrarModal}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={editIndex !== null ? 'warning' : 'primary'}
            startIcon={<SaveIcon />}
            onClick={registrarDatos}
            sx={{ fontWeight: 'bold' }}
          >
            {editIndex !== null ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled" 
          elevation={6}
          sx={{ width: '100%', fontWeight: 'medium', borderRadius: '8px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Helper interno para renderizar las opciones del dropdown de carreras de forma limpia
function crawlingCarrerasVigentes(listaCarreras) {
  if (listaCarreras.length === 0) {
    return (
      <MenuItem value="" disabled>
        No hay carreras disponibles. Regístralas primero.
      </MenuItem>
    );
  }
  return listaCarreras.map((carrera) => (
    <MenuItem key={carrera.id} value={carrera.id}>
      {carrera.nombre}
    </MenuItem>
  ));
}