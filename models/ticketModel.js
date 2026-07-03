const { query } = require('./db');

async function getTicketsByUsuario(usuarioId) {
  const result = await query(`
    SELECT t.id, COALESCE(t.codigo_ticket, t.codigo_unico) AS codigo_ticket, t.estado, t.fecha_compra, t.total,
           p.titulo AS pelicula, f.fecha, f.hora_inicio, a.fila, a.numero
    FROM tickets t
    JOIN funciones f ON f.id = t.funcion_id
    JOIN peliculas p ON p.id = f.pelicula_id
    JOIN asientos a ON a.id = t.asiento_id
    WHERE t.usuario_id = $1
    ORDER BY t.fecha_compra DESC
  `, [usuarioId]);
  return result.rows;
}

async function getTicketByFuncionAsiento(funcionId, asientoId) {
  const result = await query(`
    SELECT id FROM tickets
    WHERE funcion_id = $1 AND asiento_id = $2 AND estado != 'ANULADO'
    LIMIT 1
  `, [funcionId, asientoId]);
  return result.rows[0] || null;
}

async function getTicketByVentaId(ventaId) {
  const result = await query(`
    SELECT t.id, COALESCE(t.codigo_ticket, t.codigo_unico) AS codigo_ticket, t.estado, t.fecha_compra, t.total, t.asiento_id, t.funcion_id
    FROM tickets t
    WHERE t.venta_id = $1
    LIMIT 1
  `, [ventaId]);
  return result.rows[0] || null;
}

async function getTicketsByVentaId(ventaId) {
  const result = await query(`
    SELECT t.id, COALESCE(t.codigo_ticket, t.codigo_unico) AS codigo_ticket, t.estado, t.fecha_compra, t.total,
           f.fecha, f.hora_inicio, a.fila, a.numero, a.codigo_asiento, p.titulo AS pelicula
    FROM tickets t
    JOIN funciones f ON f.id = t.funcion_id
    JOIN peliculas p ON p.id = f.pelicula_id
    JOIN asientos a ON a.id = t.asiento_id
    WHERE t.venta_id = $1
    ORDER BY t.id
  `, [ventaId]);
  return result.rows;
}

async function createTicket({ usuarioId, funcionId, asientoId, ventaId, codigoUnico, total, peliculaId, salaId }) {
  const result = await query(`
    INSERT INTO tickets (codigo_unico, usuario_id, pelicula_id, funcion_id, sala_id, asiento_id, venta_id, estado, fecha_compra, total)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)
    RETURNING id
  `, [codigoUnico, usuarioId, peliculaId || null, funcionId, salaId || null, asientoId, ventaId, 'ACTIVO', total]);
  return result.rows[0];
}

module.exports = { getTicketsByUsuario, getTicketByFuncionAsiento, getTicketByVentaId, createTicket };
