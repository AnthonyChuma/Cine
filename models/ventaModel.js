const { query } = require('./db');

async function createVenta({ usuarioId, cajeroId, total, metodoPago }) {
  const result = await query(`
    INSERT INTO ventas (usuario_id, cajero_id, fecha_venta, total, metodo_pago, estado)
    VALUES ($1, $2, NOW(), $3, $4, $5)
    RETURNING id
  `, [usuarioId, cajeroId, total, metodoPago, 'COMPLETADA']);
  return result.rows[0];
}

async function createDetalleVenta({ ventaId, ticketId, precioUnitario }) {
  await query(`
    INSERT INTO detalle_ventas (venta_id, ticket_id, precio_unitario)
    VALUES ($1, $2, $3)
  `, [ventaId, ticketId, precioUnitario]);
}

module.exports = { createVenta, createDetalleVenta };
