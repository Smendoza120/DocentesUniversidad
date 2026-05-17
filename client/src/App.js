import './App.css';
import { useState, useEffect } from 'react';

import DocentesView from './views/DocentesView.js';
import CarrerasView from './views/CarrerasView.js';
import EstudiantesView from './views/EstudiantesView.js';

import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1e212b',
      paper: '#2c3240',
    },
    primary: {
      main: '#1e90ff',
      dark: '#104278',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#bdbdbd',
    },
    error: {
      main: '#dc3545',
    },
    warning: {
      main: '#28a745',
      dark: '#218838',
    },
    divider: '#444a59',
  },
  typography: {
    fontFamily: '"Segoe UI", "Tahoma", "Geneva", "Verdana", sans-serif',
  },
});

function App() {
  const [vistaActual, setVistaActual] = useState('docentes');

  const renderContenidoDerecho = () => {
    switch (vistaActual) {
      case 'docentes':
        return <DocentesView />;
      case 'estudiantes':
        return <EstudiantesView />;
      case 'carreras':
        return <CarrerasView />;;
      default:
        return <DocentesView />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>

        {/* Menu de navegación */}
        <Paper
          elevation={5}
          sx={{
            width: { xs: '80px', sm: '240px', md: '280px' },
            backgroundColor: '#2c3240',
            borderRadius: 0,
            borderRight: '1px solid #444a59',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s ease'
          }}
        >
          {/* Logo o Título de la Universidad */}
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Programming University
            </Typography>
            <SchoolIcon sx={{ display: { xs: 'block', sm: 'none' }, margin: '0 auto', color: 'primary.main' }} />
          </Box>

          <Divider />

          <List sx={{ p: 1 }}>
            {/* Docentes */}
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={vistaActual === 'docentes'}
                onClick={() => setVistaActual('docentes')}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(30, 144, 255, 0.15)',
                    '&:hover': { backgroundColor: 'rgba(30, 144, 255, 0.25)' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: vistaActual === 'docentes' ? 'primary.main' : 'text.secondary' }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Docentes"
                  sx={{ display: { xs: 'none', sm: 'block' }, color: vistaActual === 'docentes' ? 'primary.main' : 'text.primary' }}
                />
              </ListItemButton>
            </ListItem>

            {/* Estudiantes */}
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={vistaActual === 'estudiantes'}
                onClick={() => setVistaActual('estudiantes')}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(30, 144, 255, 0.15)',
                    '&:hover': { backgroundColor: 'rgba(30, 144, 255, 0.25)' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: vistaActual === 'estudiantes' ? 'primary.main' : 'text.secondary' }}>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Estudiantes"
                  sx={{ display: { xs: 'none', sm: 'block' }, color: vistaActual === 'estudiantes' ? 'primary.main' : 'text.primary' }}
                />
              </ListItemButton>
            </ListItem>

            {/* Carreras */}
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={vistaActual === 'carreras'}
                onClick={() => setVistaActual('carreras')}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(30, 144, 255, 0.15)',
                    '&:hover': { backgroundColor: 'rgba(30, 144, 255, 0.25)' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: vistaActual === 'carreras' ? 'primary.main' : 'text.secondary' }}>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Carreras"
                  sx={{ display: { xs: 'none', sm: 'block' }, color: vistaActual === 'carreras' ? 'primary.main' : 'text.primary' }}
                />
              </ListItemButton>
            </ListItem>

          </List>
        </Paper>

        {/* Visualizacion de informacion */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            p: 3,
            backgroundColor: 'background.default'
          }}
        >
          {renderContenidoDerecho()}
        </Box>

      </Box>
    </ThemeProvider>
  );
}
export default App;
