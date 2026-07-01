require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const cajeroRoutes = require('./routes/cajeroRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webRoutes = require('./routes/webRoutes');
const { testConnection } = require('./models/db');

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"]
    }
  }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authMiddleware);

app.use(publicRoutes);
app.use(authRoutes);
app.use(clienteRoutes);
app.use(cajeroRoutes);
app.use(adminRoutes);
app.use(webRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(errorMiddleware);

async function start() {
  try {
    await testConnection();
    console.log('Conexión a PostgreSQL lista');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a PostgreSQL:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }

    console.warn('Continuando en modo desarrollo con fallback de datos.');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  }
}

start();
