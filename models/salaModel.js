const { query } = require('./db');

function buildSeatCode(rowIndex, columnIndex) {
  let code = '';
  let value = rowIndex;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    code = String.fromCharCode(65 + remainder) + code;
    value = Math.floor((value - 1) / 26);
  }
  return `${code}${columnIndex}`;
}

async function getSalas() {
  const result = await query(`
    SELECT id, nombre, tipo, filas, columnas, capacidad_total, estado
    FROM salas
    ORDER BY id
  `);
  return result.rows;
}

async function getSalaById(id) {
  const result = await query(`
    SELECT id, nombre, tipo, filas, columnas, capacidad_total, estado
    FROM salas
    WHERE id = $1
  `, [id]);
  return result.rows[0] || null;
}

async function createSala({ nombre, tipo, filas, columnas, estado }) {
  const filasNum = Number(filas);
  const columnasNum = Number(columnas);
  const capacidadTotal = filasNum * columnasNum;
  const result = await query(`
    INSERT INTO salas (nombre, tipo, filas, columnas, capacidad_total, estado)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `, [nombre, tipo || 'ESTANDAR', filasNum, columnasNum, capacidadTotal, estado || 'ACTIVA']);
  return result.rows[0];
}

async function getAsientosBySala(salaId) {
  const result = await query(`
    SELECT id, fila, numero, codigo_asiento, estado
    FROM asientos
    WHERE sala_id = $1
    ORDER BY fila, numero
  `, [salaId]);
  return result.rows;
}

async function hasAsientos(salaId) {
  const result = await query('SELECT 1 FROM asientos WHERE sala_id = $1 LIMIT 1', [salaId]);
  return result.rows.length > 0;
}

async function generateAsientosForSala(salaId, filas, columnas) {
  const rows = Number(filas);
  const cols = Number(columnas);
  if (rows <= 0 || cols <= 0) {
    throw new Error('La sala debe tener filas y columnas mayores a cero.');
  }

  const seatCount = rows * cols;
  const insertValues = [];
  const params = [];
  let paramIndex = 1;

  for (let row = 1; row <= rows; row += 1) {
    for (let col = 1; col <= cols; col += 1) {
      params.push(salaId, String(buildSeatCode(row, col).replace(/\s/g, '')), row, col, buildSeatCode(row, col), 'DISPONIBLE');
      insertValues.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
    }
  }

  const result = await query(`
    INSERT INTO asientos (sala_id, fila, numero, codigo_asiento, estado)
    VALUES ${insertValues.join(', ')}
    RETURNING id
  `, params);

  return { created: result.rows.length, seatCount };
}

async function updateSala(id, { nombre, tipo, filas, columnas, estado }) {
  const filasNum = Number(filas);
  const columnasNum = Number(columnas);
  const capacidadTotal = filasNum * columnasNum;
  const result = await query(`
    UPDATE salas
    SET nombre = $1, tipo = $2, filas = $3, columnas = $4, capacidad_total = $5, estado = $6
    WHERE id = $7
    RETURNING id
  `, [nombre, tipo || 'ESTANDAR', filasNum, columnasNum, capacidadTotal, estado || 'ACTIVA', id]);
  return result.rows[0] || null;
}

async function updateSalaEstado(id, estado) {
  const result = await query(`
    UPDATE salas
    SET estado = $1
    WHERE id = $2
    RETURNING id
  `, [estado, id]);
  return result.rows[0] || null;
}

module.exports = {
  getSalas,
  getSalaById,
  createSala,
  updateSala,
  updateSalaEstado,
  getAsientosBySala,
  hasAsientos,
  generateAsientosForSala
};
