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
  Snackbar,
  Alert
} from '@mui/material';

// Iconos
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

export default function CarrerasView() {
  // Estado único para el formulario de carreras según tu backend
  const [nombre, setNombre] = useState('');
  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Modales de Control de Flujo (UX Mejorada)
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [indexAEliminar, setIndexAEliminar] = useState(null);

  // Notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'info' | 'warning'
  });

  // Helper para lanzar notificaciones de forma limpia
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Manejador para cerrar el Snackbar de forma automática o manual
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    cargarCarreras();
  }, []);

  // GET: Obtener todas las carreras (Le pega a /carreras de app.js)
  const cargarCarreras = async () => {
    try {
      const response = await fetch('http://localhost:3001/carreras');
      const data = await response.json();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (error) {
      setRegistros([]);
      showNotification('Error al cargar las carreras', 'error');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
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

  // POST / PUT: Registrar o Actualizar
  const registrarDatos = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      showNotification('El nombre de la carrera es requerido', 'error');
      return;
    }

    const payload = { nombre: nombre.trim() };

    if (editIndex !== null) {
      // MODO EDICIÓN (PUT a /carreras/:id)
      try {
        const carrera = registros[editIndex];
        const response = await fetch(`http://localhost:3001/carreras/${carrera.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Servidor respondió con estado ${response.status}`);
        }

        // Si tu backend responde con mensaje, actualizamos el estado local de forma limpia
        const nuevosRegistros = [...registros];
        nuevosRegistros[editIndex] = { ...carrera, nombre: payload.nombre };

        setRegistros(nuevosRegistros);
        setOpenModal(false);
        limpiarFormulario();
        setEditIndex(null);
        showNotification('Carrera actualizada correctamente', 'success');

      } catch (error) {
        showNotification(`Error al actualizar: ${error.message}`, 'error');
      }
    } else {
      // MODO CREACIÓN (POST a /carreras)
      try {
        const response = await fetch('http://localhost:3001/carreras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Servidor respondió con estado ${response.status}`);
        }

        // Tu backend retorna: { id: result.insertId, nombre: nombre.trim() }
        const data = await response.json();

        setRegistros((prev) => [...prev, data]);
        setOpenModal(false);
        limpiarFormulario();
        showNotification('Carrera guardada correctamente', 'success');

      } catch (error) {
        showNotification(`Error al guardar: ${error.message}`, 'error');
      }
    }
  };

  // DELETE: Eliminar Carrera con tu firma original intacta
  const eliminarRegistro = async (idx) => {
    const carrera = registros[idx];
    try {
      const response = await fetch(`http://localhost:3001/carreras/${carrera.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        showNotification('Carrera eliminada correctamente', 'success');
      } else {
        // Aquí capturamos la respuesta 400 del backend de referencias existentes
        const data = await response.json().catch(() => ({}));
        showNotification(data.error || 'Error al eliminar la carrera', 'error');
      }
    } catch (error) {
      showNotification('error de conexion al eliminar', 'error');
    }
  };

  const editarRegistro = (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setEditIndex(idx);
    setOpenModal(true);
  };

  // Funciones Intermedias de Intercepción para la Eliminación Segura
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
            Gestión de Carreras Universitarias
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Catálogo de programas académicos vigentes en la institución
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAbrirCrear}
          sx={{ fontWeight: 'bold', height: '48px' }}
        >
          Agregar Carrera
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '12px' }}>
        <Table sx={{ minWidth: 400 }} aria-label="tabla de carreras">
          <TableHead sx={{ backgroundColor: '#3b4251' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', width: '15%' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Nombre del Programa Académico</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', width: '20%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron carreras universitarias registradas. Utiliza el botón de arriba para registrar una nueva.
                </TableCell>
              </TableRow>
            ) : (
              registros.map((reg, idx) => (
                <TableRow
                  key={reg.id ?? idx}
                  hover
                  sx={{ '&:nth-of-type(even)': { backgroundColor: 'rgba(255,255,255,0.02)' } }}
                >
                  <TableCell>{reg.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{reg.nombre}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => editarRegistro(idx)}
                        title="Editar Nombre"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleSolicitarEliminacion(idx)}
                        title="Eliminar Carrera"
                      >
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

      {/* Dialogo de confirmacion */}
      <Dialog
        open={openConfirmModal}
        onClose={handleCancelarEliminacion}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <DeleteIcon color="error" /> ¿Eliminar Carrera Universitaria?
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1">
            ¿Estás completamente seguro de que deseas eliminar la carrera: <strong>{indexAEliminar !== null ? registros[indexAEliminar]?.nombre : ''}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Nota: Si existen estudiantes asignados a esta carrera, la base de datos rechazará automáticamente esta acción.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelarEliminacion}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmarEliminacion}
            sx={{ fontWeight: 'bold' }}
            autoFocus
          >
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de edición/creación */}
      <Dialog
        open={openModal}
        onClose={handleCerrarModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px', padding: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: editIndex !== null ? 'warning.main' : 'primary.main' }}>
          {editIndex !== null ? 'Modificar Nombre de la Carrera' : 'Registrar Nueva Carrera'}
        </DialogTitle>

        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <TextField
              label="Nombre de la Carrera"
              variant="outlined"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Ingeniería de Sistemas"
              autoFocus
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={handleCerrarModal}
          >
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
            {editIndex !== null ? 'Guardar Cambios' : 'Confirmar Registro'}
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