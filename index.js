const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// 🔥 CORS
app.use(cors());

// 🔥 JSON middleware
app.use(express.json());

// 🔥 archivos estáticos
app.use(express.static('public'));

// ==========================
// GET tutoriales
// ==========================
app.get('/tutoriales', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/tutoriales.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo JSON' });
    }
    res.json(JSON.parse(data));
  });
});

// ==========================
// POST tutoriales
// ==========================
app.post('/tutoriales', (req, res) => {
  const nuevoTutorial = req.body;

  fs.readFile(path.join(__dirname, 'data/tutoriales.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo JSON' });
    }

    const tutoriales = JSON.parse(data);
    tutoriales.push(nuevoTutorial);

    fs.writeFile(
      path.join(__dirname, 'data/tutoriales.json'),
      JSON.stringify(tutoriales, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'No se pudo guardar el archivo JSON' });
        }
        res.status(201).json({ mensaje: 'Tutorial agregado con éxito' });
      }
    );
  });
});

// ==========================
// DELETE tutoriales
// ==========================
app.delete('/tutoriales/:index', (req, res) => {
  const index = req.params.index;

  fs.readFile(path.join(__dirname, 'data/tutoriales.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo JSON' });
    }

    const tutoriales = JSON.parse(data);

    if (index < 0 || index >= tutoriales.length) {
      return res.status(400).json({ error: 'Índice inválido' });
    }

    tutoriales.splice(index, 1);

    fs.writeFile(
      path.join(__dirname, 'data/tutoriales.json'),
      JSON.stringify(tutoriales, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'No se pudo guardar el archivo JSON' });
        }
        res.json({ mensaje: 'Tutorial eliminado con éxito' });
      }
    );
  });
});

// ==========================
// 🔥 IMPORTANTE: PORT para Render
// ==========================
const PORT = process.env.PORT || 8044;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});