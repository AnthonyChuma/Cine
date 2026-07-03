const { query } = require('./db');
const peliculaModel = require('./peliculaModel');

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addMinutesToTime(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, hours, mins);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 8);
}

function isValidTimeString(value) {
  return /^\d{2}:\d{2}$/.test(value);
}

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
    SELECT f.id, f.fecha, f.hora_inicio, f.hora_fin, f.precio, f.estado, p.id AS pelicula_id, p.titulo AS pelicula, p.duracion_minutos, s.id AS sala_id, s.nombre AS sala, s.estado AS sala_estado
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
  const pelicula = await peliculaModel.getPeliculaById(pelicula_id);
  if (!pelicula) {
    throw new Error('Película no encontrada.');
  }
  if (pelicula.estado !== 'ACTIVA') {
    throw new Error('No se pueden generar funciones para una película inactiva.');
  }

  const salaResult = await query('SELECT id, estado, filas, columnas FROM salas WHERE id = $1', [sala_id]);
  const sala = salaResult.rows[0];
  if (!sala) {
    throw new Error('Sala no encontrada.');
  }
  if (sala.estado !== 'ACTIVA') {
    throw new Error('No se pueden generar funciones en una sala inactiva.');
  }

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

  const duration = Number(pelicula.duracion_minutos) || 120;
  const horarios = ['15:00', '21:00'];
  const schedule = horarios.map((hora_inicio) => ({
    hora_inicio,
    hora_fin: addMinutesToTime(hora_inicio, duration)
  }));

  const overlaps = [];
  for (const fecha of dates) {
    for (const horario of schedule) {
      const existing = await query(`
        SELECT 1 FROM funciones
        WHERE sala_id = $1
          AND fecha = $2
          AND estado = 'PROGRAMADA'
          AND (
            (hora_inicio <= $3 AND hora_fin > $3)
            OR (hora_inicio < $4 AND hora_fin >= $4)
            OR (hora_inicio >= $3 AND hora_fin <= $4)
          )
        LIMIT 1
      `, [sala_id, fecha, horario.hora_inicio, horario.hora_fin]);
      if (existing.rows.length > 0) {
        overlaps.push(`${fecha} ${horario.hora_inicio}`);
      }
    }
  }

  if (overlaps.length > 0) {
    throw new Error(`Ya existe una función programada en la misma sala para estos horarios: ${overlaps.join(', ')}.`);
  }

  const insertValues = [];
  const params = [];
  let index = 1;
  dates.forEach((fecha) => {
    schedule.forEach((horario) => {
      params.push(pelicula_id, sala_id, fecha, horario.hora_inicio, horario.hora_fin, precio, 'PROGRAMADA');
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

