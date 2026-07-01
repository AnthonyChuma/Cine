const { query } = require('./db');

async function getTicketsByUsuario(usuarioId) {
  const result = await query(`
    SELECT t.id, t.codigo_unico, t.estado, t.fecha_compra, t.total, p.titulo AS pelicula, f.fecha, f.hora_inicio, a.fila, a.numero
    FROM tickets t
    JOIN funciones f ON f.id = t.funcion_id
    JOIN peliculas p ON p.id = f.pelicula_id
    JOIN asientos a ON a.id = t.asiento_id
    WHERE t.usuario_id = $1
    ORDER BY t.fecha_compra DESC
  `, [usuarioId]);
  return result.rows;
}

async function createTicket({ usuarioId, funcionId, asientoId, codigoUnico, total }) {
  const result = await query(`
    INSERT INTO tickets (codigo_unico, usuario_id, funcion_id, asiento_id, estado, fecha_compra, total)
    VALUES ($1, $2, $3, $4, $5, NOW(), $6)
    RETURNING id
  `, [codigoUnico, usuarioId, funcionId, asientoId, 'VENDIDO', total]);
  return result.rows[0];
}

module.exports = { getTicketsByUsuario, createTicket };
