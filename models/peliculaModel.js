const { query } = require('./db');

async function getPeliculas({ vigentes = true } = {}) {
  const conditions = vigentes
    ? `WHERE p.estado = 'ACTIVA'
       AND (p.fecha_inicio_vigencia IS NULL OR p.fecha_inicio_vigencia <= CURRENT_DATE)
       AND (p.fecha_fin_vigencia IS NULL OR p.fecha_fin_vigencia >= CURRENT_DATE)`
    : '';

  const result = await query(`
    SELECT p.id, p.titulo, p.sinopsis, p.duracion_minutos, p.clasificacion, p.imagen_url, p.trailer_url, p.estado,
           p.fecha_estreno, p.fecha_inicio_vigencia, p.fecha_fin_vigencia, p.destacada, p.promocion,
           g.nombre AS genero
    FROM peliculas p
    LEFT JOIN generos g ON g.id = p.genero_id
    ${conditions}
    ORDER BY p.fecha_inicio_vigencia DESC NULLS LAST, p.fecha_estreno DESC
  `);
  return result.rows;
}

async function getPeliculasAdmin() {
  const result = await query(`
    SELECT p.id, p.titulo, p.sinopsis, p.duracion_minutos, p.clasificacion, p.imagen_url, p.trailer_url, p.estado,
           p.fecha_estreno, p.fecha_inicio_vigencia, p.fecha_fin_vigencia, p.destacada, p.promocion,
           g.nombre AS genero
    FROM peliculas p
    LEFT JOIN generos g ON g.id = p.genero_id
    ORDER BY p.fecha_inicio_vigencia DESC NULLS LAST, p.fecha_estreno DESC
  `);
  return result.rows;
}

async function getPeliculaById(id) {
  const result = await query(`
    SELECT p.id, p.titulo, p.sinopsis, p.duracion_minutos, p.clasificacion, p.imagen_url, p.trailer_url, p.estado,
           p.fecha_estreno, p.fecha_inicio_vigencia, p.fecha_fin_vigencia, p.destacada, p.promocion,
           g.nombre AS genero
    FROM peliculas p
    LEFT JOIN generos g ON g.id = p.genero_id
    WHERE p.id = $1
  `, [id]);
  return result.rows[0] || null;
}

async function getPeliculaActivaVigenteById(id) {
  const result = await query(`
    SELECT p.id, p.titulo, p.sinopsis, p.duracion_minutos, p.clasificacion, p.imagen_url, p.trailer_url, p.estado,
           p.fecha_estreno, p.fecha_inicio_vigencia, p.fecha_fin_vigencia, p.destacada, p.promocion,
           g.nombre AS genero
    FROM peliculas p
    LEFT JOIN generos g ON g.id = p.genero_id
    WHERE p.id = $1
      AND p.estado = 'ACTIVA'
      AND (p.fecha_inicio_vigencia IS NULL OR p.fecha_inicio_vigencia <= CURRENT_DATE)
      AND (p.fecha_fin_vigencia IS NULL OR p.fecha_fin_vigencia >= CURRENT_DATE)
  `, [id]);
  return result.rows[0] || null;
}

async function createPelicula(data) {
  const inicio = data.fecha_inicio_vigencia ? new Date(data.fecha_inicio_vigencia) : null;
  const fin = data.fecha_fin_vigencia ? new Date(data.fecha_fin_vigencia) : null;
  let fechaFin = fin;
  if (inicio && !fin) {
    fechaFin = new Date(inicio);
    fechaFin.setDate(fechaFin.getDate() + 30);
  }
  const result = await query(`
    INSERT INTO peliculas (titulo, sinopsis, duracion_minutos, clasificacion, imagen_url, trailer_url, estado, fecha_estreno,
                            genero_id, fecha_inicio_vigencia, fecha_fin_vigencia, destacada, promocion)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING id
  `, [
    data.titulo,
    data.sinopsis || null,
    Number(data.duracion_minutos) || null,
    data.clasificacion || null,
    data.imagen_url || null,
    data.trailer_url || null,
    data.estado || 'ACTIVA',
    data.fecha_estreno || null,
    data.genero_id || null,
    data.fecha_inicio_vigencia || null,
    fechaFin ? fechaFin.toISOString().slice(0, 10) : null,
    data.destacada === 'on' || data.destacada === true || data.destacada === 'true',
    data.promocion || null
  ]);
  return result.rows[0];
}

async function updatePelicula(id, data) {
  const result = await query(`
    UPDATE peliculas SET titulo = $1, sinopsis = $2, duracion_minutos = $3, clasificacion = $4, imagen_url = $5,
                         trailer_url = $6, estado = $7, fecha_estreno = $8, genero_id = $9,
                         fecha_inicio_vigencia = $10, fecha_fin_vigencia = $11, destacada = $12, promocion = $13
    WHERE id = $14 RETURNING id
  `, [
    data.titulo,
    data.sinopsis || null,
    Number(data.duracion_minutos) || null,
    data.clasificacion || null,
    data.imagen_url || null,
    data.trailer_url || null,
    data.estado || 'ACTIVA',
    data.fecha_estreno || null,
    data.genero_id || null,
    data.fecha_inicio_vigencia || null,
    data.fecha_fin_vigencia || null,
    data.destacada === 'on' || data.destacada === true || data.destacada === 'true',
    data.promocion || null,
    id
  ]);
  return result.rows[0];
}

async function deletePelicula(id) {
  const result = await query(`
    UPDATE peliculas
    SET estado = 'INACTIVA'
    WHERE id = $1
    RETURNING id
  `, [id]);
  return result.rows[0] || null;
}

module.exports = { getPeliculas, getPeliculasAdmin, getPeliculaById, getPeliculaActivaVigenteById, createPelicula, updatePelicula, deletePelicula };

