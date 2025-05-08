const express = require('express');
const path = require('path');
const router = express.Router();
const { Client } = require('pg');

// Conexión a PostgreSQL usando DATABASE_URL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL desde rutas'))
  .catch(err => console.error('❌ Error al conectar desde rutas:', err));

// Ruta HTML raíz
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// GET /participantes
router.get('/participantes', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM participantes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener participantes' });
  }
});

// POST /participantes
router.post('/participantes', async (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const result = await client.query(
      'INSERT INTO participantes (nombre, correo) VALUES ($1, $2) RETURNING *',
      [nombre, correo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al insertar participante' });
  }
});

module.exports = router;
