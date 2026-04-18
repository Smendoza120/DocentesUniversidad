import { useState, useEffect } from 'react';

import './App.css';



function App() {
 
  // memoria del formulario 
  const [nombre, setNombre] = useState ('');
  const [correo, setCorreo] = useState ('');
  const [telefono, setTelefono] = useState ('');
  const [titulo, setTitulo] = useState ('');
  const [areaAcademica, setAreaAcademica] = useState ('');
  const [dedicacion, setDedicacion] = useState ('');
  const [aniosExperiencia, setAniosExperiencia] = useState (0);
    
   const [registros, setRegistros] = useState([]);

   const [editIndex, setEditIndex] = useState(null);
  
   useEffect(() => {

    cargarDocentes();

   }, []);

   const cargarDocentes = async () => {
     
     try{

       const respons = await fetch('http://localhost:3001/docentes');
       const data = await respons.json();
       setRegistros(data);

     }
     catch (error) {

       alert('error al cargar los docentes');

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

     const registrarDatos = async (e) =>  {

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

          // ruta de actualizar 

          try{


           const docentes = registros[editIndex];
           const response = await fetch(`http://localhost:3001/docentes/${docentes.id}`, {

            method: 'PUT',
            header: {'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
           });

            if (response.ok){
              const nuevosRegistros = [...registros];
              nuevosRegistros[editIndex] = {
                ...docentes,
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
              alert('docente actualizado correctamente');

            }else{
              const err = await response.json().catch(() => ({}));
              alert(err.error || 'Error al actualizar el docente');
            }

          }catch (error){
            alert('Error de conexion al actualizar');

          }

        }else

          // ruta  de crear 

     }
















 





  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
