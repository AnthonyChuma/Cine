const { query } = require('./db');

async function getPeliculas() {
  const result = await query(`
    SELECT p.id, p.titulo, p.sinopsis, p.duracion_minutos, p.clasificacion, p.imagen_url, p.trailer_url, p.estado, p.fecha_estreno, g.nombre AS genero
    FROM peliculas p
    LEFT JOIN generos g ON g.id = p.genero_id
    WHERE p.estado = 'ACTIVA'
    ORDER BY p.fecha_estreno DESC
  `);
  return result.rows;
}

async function getPeliculaById(id) {
  const result = await query(`
    SELECT p.id, p.titulo, p.sinopsis, p.duracion_minutos, p.clasificacion, p.imagen_url, p.trailer_url, p.estado, p.fecha_estreno, g.nombre AS genero
    FROM peliculas p
    LEFT JOIN generos g ON g.id = p.genero_id
    WHERE p.id = $1
  `, [id]);
  return result.rows[0] || null;
}

async function createPelicula(data) {
  const result = await query(`
    INSERT INTO peliculas (titulo, sinopsis, duracion_minutos, clasificacion, imagen_url, trailer_url, estado, fecha_estreno, genero_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `, [data.titulo, data.sinopsis || null, data.duracion_minutos || null, data.clasificacion || null, data.imagen_url || null, data.trailer_url || null, data.estado || 'ACTIVA', data.fecha_estreno || null, data.genero_id || null]);
  return result.rows[0];
}

async function updatePelicula(id, data) {
  const result = await query(`
    UPDATE peliculas SET titulo = $1, sinopsis = $2, duracion_minutos = $3, clasificacion = $4, imagen_url = $5, trailer_url = $6, estado = $7, fecha_estreno = $8, genero_id = $9
    WHERE id = $10 RETURNING id
  `, [data.titulo, data.sinopsis || null, data.duracion_minutos || null, data.clasificacion || null, data.imagen_url || null, data.trailer_url || null, data.estado || 'ACTIVA', data.fecha_estreno || null, data.genero_id || null, id]);
  return result.rows[0];
}

async function deletePelicula(id) {
  await query('DELETE FROM peliculas WHERE id = $1', [id]);
}

module.exports = { getPeliculas, getPeliculaById, createPelicula, updatePelicula, deletePelicula };
