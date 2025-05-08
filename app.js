const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

// Usar el puerto que Railway asigna, o 3000 en local
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON si lo necesitas
app.use(express.json());

// Usar router principal
app.use('/', indexRouter);

// Ruta catch-all para errores 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
