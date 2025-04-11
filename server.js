const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Importa el paquete CORS
const app = express();

// Middleware para habilitar CORS
app.use(cors());  // Habilita CORS para todas las rutas

// Middleware para permitir el manejo de JSON
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos como HTML, CSS, JS

// Ruta para obtener los tutoriales
app.get('/tutoriales', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/tutoriales.json'), 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo leer el archivo JSON' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para agregar un tutorial
app.post('/tutoriales', (req, res) => {
  const nuevoTutorial = req.body;

  fs.readFile(path.join(__dirname, 'data/tutoriales.json'), 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo leer el archivo JSON' });
      return;
    }
    
    const tutoriales = JSON.parse(data);
    tutoriales.push(nuevoTutorial);

    fs.writeFile(path.join(__dirname, 'data/tutoriales.json'), JSON.stringify(tutoriales, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'No se pudo guardar el archivo JSON' });
        return;
      }
      res.status(201).json({ mensaje: 'Tutorial agregado con éxito' });
    });
  });
});

// Ruta para eliminar un tutorial
app.delete('/tutoriales/:index', (req, res) => {
  const index = req.params.index; // Obtener el índice del tutorial desde la URL

  fs.readFile(path.join(__dirname, 'data/tutoriales.json'), 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo leer el archivo JSON' });
      return;
    }

    const tutoriales = JSON.parse(data);
    if (index < 0 || index >= tutoriales.length) {
      res.status(400).json({ error: 'Índice inválido' });
      return;
    }

    // Eliminar el tutorial
    tutoriales.splice(index, 1);

    fs.writeFile(path.join(__dirname, 'data/tutoriales.json'), JSON.stringify(tutoriales, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'No se pudo guardar el archivo JSON' });
        return;
      }
      res.status(200).json({ mensaje: 'Tutorial eliminado con éxito' });
    });
  });
});

// Iniciar servidor en el puerto 8044
app.listen(8044, () => {
  console.log('Servidor corriendo en http://localhost:8044');
});
