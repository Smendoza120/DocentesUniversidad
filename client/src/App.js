import { useState, useEffect } from 'react';
import './App.css';


function App() {
  //memoria del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [titulo, setTitulo] = useState('');
  const [areaAcademica, setAreaAcademica] = useState('');
  const [dedicacion, setDedicacion] = useState('');
  const [aniosExperiencia, setAniosExperiencia] = useState(0);
  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      const response = await fetch('http://localhost:3001/docentes');
      const data = await response.json();
      setRegistros(Array.isArray(data) ? data : []);
    }
    catch (error) {
      setRegistros([]);
      alert('error al cargar lo docentes');
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
      //ruta de actualizar
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
          setEditIndex(null);
          alert('Docente actualizado correctamente');
        } else {
          const err = await response.json().catch(() => ({}));
          alert(err.error || 'Error al actualizar el docente');
        }
      } catch (error) {
        alert('error de conexion al actualizar');
      }

    } else {
      //ruta de crear
      try {
        const response = await fetch('http://localhost:3001/docente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          setRegistros((prev) => [...(Array.isArray(prev) ? prev : []), data]);
          
          alert('Docente guardaddo correctamente')
        } else {
          alert(data.error || 'Error al guardar el docente')
        }

      } catch (error) {
        alert(`error de conexion al guardar: ${error.message}`);
      }
    }
    // limpiarFormulario();
  };

  //función para eliminar registro
  const eliminarRegistro = async (idx) => {
    const docente = registros[idx];
    try {
      const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));

        if (editIndex === idx) {
          setEditIndex(null);
          limpiarFormulario()
        }
        alert('Docente eliminado correctamente')
      } else {
        alert('Error al eliminar el docente')
      }
    } catch (error) {
      alert('error de conexion al eliminar');
    }
  };

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

  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Gestión de docentes universitarios</h1>
        <p className="app-subtitle">Registro de profesores: datos académicos y de contacto</p>
      </header>

      <div className="datos">        
        <label>
          Nombre completo:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. María Fernanda López"
          />
        </label>

        <label>
          Correo institucional:
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="nombre@universidad.edu"
          />
        </label>

        <label>
          Teléfono:
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. +57 300 1234567"
          />
        </label>

        <label>
          Título académico máximo:
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Doctorado, Maestría, Especialización"
          />
        </label>

        <label>
          Área o programa académico:
          <input
            type="text"
            value={areaAcademica}
            onChange={(e) => setAreaAcademica(e.target.value)}
            placeholder="Ej. Ingeniería de Software, Matemáticas"
          />
        </label>

        <label>
          Dedicación:
          <input
            type="text"
            value={dedicacion}
            onChange={(e) => setDedicacion(e.target.value)}
            placeholder="Tiempo completo, medio tiempo, cátedra"
          />
        </label>

        <label>
          Años de experiencia docente:
          <input
            type="number"
            min={0}
            value={aniosExperiencia}
            onChange={(e) => setAniosExperiencia(Number(e.target.value))}
          />
        </label>

        <button type="button" onClick={registrarDatos}>
          {editIndex !== null ? 'Actualizar' : 'Registrar'}
        </button>
      </div>

      {registros.length > 0 && (
        <div className="tabla-container">
          <table className="tabla-registros">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Título</th>
                <th>Área académica</th>
                <th>Dedicación</th>
                <th>Años doc.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((reg, idx) => (
                <tr key={reg.id ?? idx}>
                  <td>{reg.nombre}</td>
                  <td>{reg.correo}</td>
                  <td>{reg.telefono}</td>
                  <td>{reg.titulo}</td>
                  <td>{reg.area_academica}</td>
                  <td>{reg.dedicacion}</td>
                  <td>{reg.anios_experiencia}</td>
                  <td>
                    <button
                      className="btn-editar"
                      type="button"
                      onClick={() => editarRegistro(idx)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      type="button"
                      onClick={() => eliminarRegistro(idx)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default App;
