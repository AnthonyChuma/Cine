const { query } = require('./db');

async function createPago({ ventaId, metodoPago, monto, referenciaPago, estado }) {
  const result = await query(`
    INSERT INTO pagos (venta_id, metodo_pago, monto, referencia_pago, estado, fecha_pago)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id
  `, [ventaId, metodoPago, monto, referenciaPago || null, estado || 'PENDIENTE']);
  return result.rows[0];
}

async function getPagoByVentaId(ventaId) {
  const result = await query(`
    SELECT id, venta_id, metodo_pago, monto, referencia_pago, estado, fecha_pago
    FROM pagos
    WHERE venta_id = $1
  `, [ventaId]);
  return result.rows[0] || null;
}

async function updatePagoEstado(id, estado) {
  const result = await query(`
    UPDATE pagos SET estado = $1 WHERE id = $2 RETURNING id
  `, [estado, id]);
  return result.rows[0];
}

module.exports = { createPago, getPagoByVentaId, updatePagoEstado };
