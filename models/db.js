const { Pool } = require('pg');

const mockData = {
  peliculas: [
    { id: 1, titulo: 'Avatar: El Camino del Agua', sinopsis: 'Una aventura visual de ciencia ficción.', duracion_minutos: 192, clasificacion: 'ATP', imagen_url: '', trailer_url: '', estado: 'ACTIVA', fecha_estreno: '2025-01-01', genero: 'Ciencia Ficción' },
    { id: 2, titulo: 'Intensamente 2', sinopsis: 'Una historia emotiva y familiar.', duracion_minutos: 96, clasificacion: 'ATP', imagen_url: '', trailer_url: '', estado: 'ACTIVA', fecha_estreno: '2025-01-10', genero: 'Comedia' }
  ],
  funciones: [
    { id: 1, pelicula_id: 1, pelicula: 'Avatar: El Camino del Agua', sala: 'Sala 1', fecha: '2026-07-01', hora_inicio: '18:00', hora_fin: '21:12', precio: '35.00', estado: 'PROGRAMADA' },
    { id: 2, pelicula_id: 2, pelicula: 'Intensamente 2', sala: 'Sala 2', fecha: '2026-07-01', hora_inicio: '16:00', hora_fin: '17:36', precio: '25.00', estado: 'PROGRAMADA' }
  ]
};

function getConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.DATABASE_PUBLIC_URL) {
    return process.env.DATABASE_PUBLIC_URL;
  }

  const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
  if (PGHOST && PGDATABASE && PGUSER && PGPASSWORD) {
    return `postgresql://${encodeURIComponent(PGUSER)}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}:${PGPORT || 5432}/${PGDATABASE}`;
  }

  return null;
}

const connectionString = getConnectionString();
const pool = new Pool(connectionString ? {
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
} : {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

function fallbackForQuery(text, params = []) {
  const normalized = text.toUpperCase();
  if (normalized.includes('FROM PELICULAS')) {
    if (params.length > 0) {
      const id = Number(params[0]);
      const row = mockData.peliculas.find((item) => item.id === id);
      return { rows: row ? [row] : [] };
    }
    return { rows: mockData.peliculas };
  }

  if (normalized.includes('FROM FUNCIONES')) {
    if (params.length > 0) {
      const id = Number(params[0]);
      const row = mockData.funciones.find((item) => item.id === id);
      return { rows: row ? [row] : [] };
    }
    return { rows: mockData.funciones };
  }

  if (normalized.includes('FROM USUARIOS')) {
    return { rows: [] };
  }

  if (normalized.includes('INSERT INTO')) {
    return { rows: [{ id: Date.now() }] };
  }

  if (normalized.includes('DELETE FROM')) {
    return { rows: [] };
  }

  return null;
}

async function query(text, params = []) {
  try {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const fallback = fallbackForQuery(text, params);
      if (fallback) {
        return fallback;
      }
    }

    throw error;
  }
}

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    return result.rows[0];
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      const wrappedError = new Error('No se pudo conectar a PostgreSQL de Railway. Verifica DATABASE_URL o DATABASE_PUBLIC_URL, o las variables PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD.');
      wrappedError.cause = error;
      throw wrappedError;
    }

    console.warn('PostgreSQL no disponible. Usando datos de respaldo en desarrollo.');
    return { now: new Date().toISOString() };
  }
}

module.exports = { pool, query, testConnection };
