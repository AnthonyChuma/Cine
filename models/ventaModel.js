const { query } = require('./db');

async function createVenta({ usuarioId, cajeroId, total, metodoPago, estado }) {
  const result = await query(`
    INSERT INTO ventas (usuario_id, cajero_id, fecha_venta, total, metodo_pago, estado)
    VALUES ($1, $2, NOW(), $3, $4, $5)
    RETURNING id, usuario_id
  `, [usuarioId, cajeroId, total, metodoPago, estado || 'PENDIENTE']);
  return result.rows[0];
}

async function updateVentaEstado(id, estado) {
  const result = await query(`
    UPDATE ventas SET estado = $1 WHERE id = $2 RETURNING id
  `, [estado, id]);
  return result.rows[0];
}

async function getVentaById(id) {
  const result = await query(`
    SELECT id, usuario_id, cajero_id, fecha_venta, total, metodo_pago, estado FROM ventas WHERE id = $1
  `, [id]);
  return result.rows[0] || null;
}

async function createDetalleVenta({ ventaId, ticketId, precioUnitario }) {
  await query(`
    INSERT INTO detalle_ventas (venta_id, ticket_id, precio_unitario)
    VALUES ($1, $2, $3)
  `, [ventaId, ticketId, precioUnitario]);
}

module.exports = { createVenta, updateVentaEstado, getVentaById, createDetalleVenta };
