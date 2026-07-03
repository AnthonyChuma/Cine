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
    WHERE f.pelicula_id = $1 AND f.estado = 'PROGRAMADA' AND f.fecha >= CURRENT_DATE
    ORDER BY f.fecha, f.hora_inicio
  `, [peliculaId]);
  return result.rows;
}

async function getFuncionById(id) {
  const result = await query(`
    SELECT f.id, f.fecha, f.hora_inicio, f.hora_fin, f.precio, f.estado, p.id AS pelicula_id, p.titulo AS pelicula, s.id AS sala_id, s.nombre AS sala
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

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

async function generarFuncionesMensuales({ pelicula_id, sala_id, fecha_inicio_vigencia, fecha_fin_vigencia, precio }) {
  const startDate = new Date(fecha_inicio_vigencia);
  const endDate = fecha_fin_vigencia ? new Date(fecha_fin_vigencia) : addDays(startDate, 30);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Fechas de vigencia inválidas');
  }
  if (endDate < startDate) {
    throw new Error('La fecha fin de vigencia debe ser posterior a la fecha inicio');
  }

  const dates = [];
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    dates.push(formatDate(date));
  }

  const existing = await query(`
    SELECT 1 FROM funciones
    WHERE sala_id = $1 AND fecha BETWEEN $2 AND $3 AND estado = 'PROGRAMADA'
      AND hora_inicio IN ('15:00', '21:00')
    LIMIT 1
  `, [sala_id, formatDate(startDate), formatDate(endDate)]);

  if (existing.rows.length > 0) {
    throw new Error('Ya existe una función programada en la misma sala para las fechas seleccionadas.');
  }

  const insertValues = [];
  const params = [];
  let index = 1;
  dates.forEach((fecha) => {
    ['15:00', '21:00'].forEach((hora_inicio) => {
      const hora_fin = hora_inicio === '15:00' ? '18:00' : '00:00';
      params.push(pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, 'PROGRAMADA');
      insertValues.push(`($${index++}, $${index++}, $${index++}, $${index++}, $${index++}, $${index++}, $${index++})`);
    });
  });

  if (insertValues.length === 0) {
    return { created: 0 };
  }

  const result = await query(`
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora_inicio, hora_fin, precio, estado)
    VALUES ${insertValues.join(', ')}
    RETURNING id
  `, params);

  return { created: result.rows.length };
}

module.exports = { getFunciones, getFuncionesPorPelicula, getFuncionById, createFuncion, updateFuncion, deleteFuncion, generarFuncionesMensuales };

