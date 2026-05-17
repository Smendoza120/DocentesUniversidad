import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  createTheme,
  ThemeProvider,
  Box,
  Button,
  Paper,
  TextField,
  CssBaseline,
  Container,
  Typography,
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

export default function DocentesView() {
  // Datos formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [titulo, setTitulo] = useState('');
  const [areaAcademica, setAreaAcademica] = useState('');
  const [dedicacion, setDedicacion] = useState('');
  const [aniosExperiencia, setAniosExperiencia] = useState(0);
  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Variables necesarias
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [indexAEliminar, setIndexAEliminar] = useState(null);

  //Notificaciones
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
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      const response = await fetch('http://localhost:3001/docentes');
      const data = await response.json();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (error) {
      setRegistros([]);
      showNotification('Error al conectar con el servidor para cargar las carreras', 'error');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setTitulo('');
    setAreaAcademica('');
    setDedicacion('');
    setAniosExperiencia(0);
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

  const registrarDatos = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      correo,
      telefono,
      titulo,
      area_academica: areaAcademica,
      dedicacion,
      anios_experiencia: aniosExperiencia,
    };

    if (editIndex !== null) {
      try {
        const docente = registros[editIndex];
        const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const nuevosRegistros = [...registros];
          nuevosRegistros[editIndex] = {
            ...docente,
            nombre,
            correo,
            telefono,
            titulo,
            area_academica: areaAcademica,
            dedicacion,
            anios_experiencia: aniosExperiencia,
          };
          setRegistros(nuevosRegistros);
          // setEditIndex(null);
          setOpenModal(false);
          limpiarFormulario();
          showNotification('Carrera actualizada correctamente', 'success');
        }
      } catch (error) {
        showNotification('Error de conexión al actualizar', 'error');
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/docentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          setRegistros((prev) => [...(Array.isArray(prev) ? prev : []), data]);
          setOpenModal(false);
          limpiarFormulario();
          showNotification('Carrera registrada exitosamente', 'success');
        } else {
          showNotification(data.error || 'Error al guardar el docente', 'error');
        }
      } catch (error) {
        showNotification(`Error de conexión al guardar: ${error.message}`, 'error');
      }
    }
  };

  //Funciones de eliminacion
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

  const eliminarRegistro = async (idx) => {
    const docente = registros[idx];
    try {
      const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        showNotification('Docente eliminado correctamente', 'success');
      } else {
        showNotification('Error al eliminar el docente', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión al eliminar', 'error');
    }
  };

  // Funciones de edicion
  const editarRegistro = (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setCorreo(reg.correo);
    setTelefono(reg.telefono);
    setTitulo(reg.titulo);
    setAreaAcademica(reg.area_academica);
    setDedicacion(reg.dedicacion);
    setAniosExperiencia(reg.anios_experiencia);
    setEditIndex(idx);
    setOpenModal(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Gestión de Docentes Universitarios
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Visualización y administración del cuerpo docente institucional
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAbrirCrear}
          sx={{ fontWeight: 'bold', height: '48px' }}
        >
          Agregar Docente
        </Button>
      </Box>

      {/* Tabla */}
      {registros.length > 0 && (
        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '12px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de docentes">
            <TableHead sx={{ backgroundColor: '#3b4251' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Correo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Área académica</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Dedicación</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Años Doc.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registros.map((reg, idx) => (
                <TableRow
                  key={reg.id ?? idx}
                  hover
                  sx={{ '&:nth-of-type(even)': { backgroundColor: 'rgba(255,255,255,0.02)' } }}
                >
                  <TableCell>{reg.nombre}</TableCell>
                  <TableCell>{reg.correo}</TableCell>
                  <TableCell>{reg.telefono}</TableCell>
                  <TableCell>{reg.titulo}</TableCell>
                  <TableCell>{reg.area_academica}</TableCell>
                  <TableCell>{reg.dedicacion}</TableCell>
                  <TableCell>{reg.anios_experiencia}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => editarRegistro(idx)}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleSolicitarEliminacion(idx)}
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de eliminacion */}
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
          <DeleteIcon color="error" /> ¿Confirmar eliminación?
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar al docente <strong>{indexAEliminar !== null ? registros[indexAEliminar]?.nombre : ''}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción es irreversible y removerá permanentemente el registro del sistema.
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

      {/* Dialog de edicion y creacion */}
      <Dialog
        open={openModal}
        onClose={handleCerrarModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px', padding: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: editIndex !== null ? 'warning.main' : 'primary.main' }}>
          {editIndex !== null ? 'Modificar Información del Docente' : 'Registrar Nuevo Docente'}
        </DialogTitle>

        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
              <TextField
                label="Nombre completo"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. María Fernanda López"
                sx={{ flex: '1 1 100%' }}
              />
              <TextField
                label="Correo institucional"
                type="email"
                variant="outlined"
                fullWidth
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="nombre@universidad.edu"
                sx={{ flex: '1 1 48%' }}
              />
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. +57 300 1234567"
                sx={{ flex: '1 1 48%' }}
              />
              <TextField
                label="Título académico máximo"
                variant="outlined"
                fullWidth
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Doctorado, Maestría"
                sx={{ flex: '1 1 48%' }}
              />
              <TextField
                label="Área o programa académico"
                variant="outlined"
                fullWidth
                value={areaAcademica}
                onChange={(e) => setAreaAcademica(e.target.value)}
                placeholder="Ej. Ingeniería de Software"
                sx={{ flex: '1 1 48%' }}
              />
              <TextField
                label="Dedicación"
                variant="outlined"
                fullWidth
                value={dedicacion}
                onChange={(e) => setDedicacion(e.target.value)}
                placeholder="Tiempo completo, cátedra"
                sx={{ flex: '1 1 58%' }}
              />
              <TextField
                label="Años de experiencia"
                type="number"
                variant="outlined"
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={aniosExperiencia}
                onChange={(e) => setAniosExperiencia(Number(e.target.value))}
                sx={{ flex: '1 1 30%' }}
              />
            </Box>
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