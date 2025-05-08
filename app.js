const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Conexión a PostgreSQL en Railway
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Ruta principal
app.get('/', (req, res) => {
  res.send('API alphasec funcionando 🎯');
});

// GET /participantes - obtener lista
app.get('/participantes', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM participantes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener participantes' });
  }
});

// POST /participantes - agregar nuevo
app.post('/participantes', async (req, res) => {
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
