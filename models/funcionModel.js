const { query } = require('./db');

async function getFunciones() {
  const result = await query(`
    SELECT f.id, f.fecha, f.hora_inicio, f.hora_fin, f.precio, f.estado, p.titulo AS pelicula, s.nombre AS sala
    FROM funciones f
    JOIN peliculas p ON p.id = f.pelicula_id
    JOIN salas s ON s.id = f.sala_id
    ORDER BY f.fecha, f.hora_inicio
  `);
  return result.rows;
}

async function getFuncionesPorPelicula(peliculaId) {
  const result = await query(`
    SELECT f.id, f.fecha, f.hora_inicio, f.hora_fin, f.precio, f.estado, s.nombre AS sala
    FROM funciones f
    JOIN salas s ON s.id = f.sala_id
    WHERE f.pelicula_id = $1 AND f.estado = 'PROGRAMADA'
    ORDER BY f.fecha, f.hora_inicio
  `, [peliculaId]);
  return result.rows;
}

async function getFuncionById(id) {
  const result = await query(`
    SELECT f.id, f.fecha, f.hora_inicio, f.hora_fin, f.precio, f.estado, p.id AS pelicula_id, p.titulo AS pelicula, s.nombre AS sala
    FROM funciones f
    JOIN peliculas p ON p.id = f.pelicula_id
    JOIN salas s ON s.id = f.sala_id
    WHERE f.id = $1
  `, [id]);
  return result.rows[0] || null;
}

async function createFuncion(data) {
  const result = await query(`
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `, [data.pelicula_id, data.sala_id, data.fecha, data.hora_inicio, data.hora_fin, data.precio, data.estado || 'PROGRAMADA']);
  return result.rows[0];
}

async function updateFuncion(id, data) {
  const result = await query(`
    UPDATE funciones SET pelicula_id = $1, sala_id = $2, fecha = $3, hora_inicio = $4, hora_fin = $5, precio = $6, estado = $7 WHERE id = $8 RETURNING id
  `, [data.pelicula_id, data.sala_id, data.fecha, data.hora_inicio, data.hora_fin, data.precio, data.estado || 'PROGRAMADA', id]);
  return result.rows[0];
}

async function deleteFuncion(id) {
  await query('DELETE FROM funciones WHERE id = $1', [id]);
}

module.exports = { getFunciones, getFuncionesPorPelicula, getFuncionById, createFuncion, updateFuncion, deleteFuncion };
