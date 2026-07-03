const { query } = require('./db');

async function getAsientosByFuncion(funcionId) {
  const result = await query(`
    SELECT a.id, a.fila, a.numero, a.codigo_asiento, a.estado,
           COALESCE(t.id IS NOT NULL, false) AS ocupado
    FROM asientos a
    JOIN funciones f ON f.sala_id = a.sala_id
    LEFT JOIN tickets t ON t.asiento_id = a.id AND t.funcion_id = $1 AND t.estado IN ('ACTIVO', 'USADO')
    WHERE f.id = $1
    ORDER BY a.fila, a.numero
  `, [funcionId]);
  return result.rows.map((row) => ({
    ...row,
    ocupado: row.ocupado === true
  }));
}

async function getAsientoById(asientoId) {
  const result = await query(`
    SELECT id, sala_id, fila, numero, codigo_asiento, estado
    FROM asientos
    WHERE id = $1
  `, [asientoId]);
  return result.rows[0] || null;
}

module.exports = { getAsientosByFuncion, getAsientoById };
