const { query } = require('./db');

async function getResumen() {
  const [ventas, tickets, usuarios, peliculas] = await Promise.all([
    query('SELECT COALESCE(SUM(total),0) AS total FROM ventas WHERE estado = $1', ['COMPLETADA']),
    query("SELECT COUNT(*)::int AS total FROM tickets WHERE estado IN ('ACTIVO', 'USADO')"),
    query('SELECT COUNT(*)::int AS total FROM usuarios'),
    query('SELECT COUNT(*)::int AS total FROM peliculas WHERE estado = $1', ['ACTIVA'])
  ]);

  return {
    ventas: ventas.rows[0]?.total || 0,
    tickets: tickets.rows[0]?.total || 0,
    usuarios: usuarios.rows[0]?.total || 0,
    peliculas: peliculas.rows[0]?.total || 0
  };
}

async function getVentasPorPelicula() {
  const result = await query(`
    SELECT p.id AS pelicula_id, p.titulo AS pelicula,
           COUNT(t.id)::int AS entradas_vendidas,
           COALESCE(SUM(t.total),0)::numeric(10,2) AS ingresos_totales,
           ARRAY_AGG(DISTINCT f.fecha ORDER BY f.fecha) AS funciones,
           ARRAY_AGG(DISTINCT a.codigo_asiento ORDER BY a.codigo_asiento) AS asientos_vendidos
    FROM tickets t
    JOIN ventas v ON v.id = t.venta_id
    JOIN funciones f ON f.id = t.funcion_id
    JOIN peliculas p ON p.id = f.pelicula_id
    JOIN asientos a ON a.id = t.asiento_id
    WHERE t.estado != 'ANULADO'
      AND v.estado = 'COMPLETADA'
    GROUP BY p.id, p.titulo
    ORDER BY entradas_vendidas DESC
  `);
  return result.rows;
}

async function getReportePorPelicula(peliculaId) {
  const result = await query(`
    SELECT p.id AS pelicula_id, p.titulo,
           COUNT(t.id)::int AS cantidad_tickets,
           COUNT(CASE WHEN t.estado = 'ACTIVO' THEN 1 END)::int AS cantidad_activos,
           COUNT(CASE WHEN t.estado = 'USADO' THEN 1 END)::int AS cantidad_usados,
           COUNT(CASE WHEN t.estado = 'ANULADO' THEN 1 END)::int AS cantidad_anulados,
           COALESCE(SUM(CASE WHEN v.estado = 'COMPLETADA' THEN t.total ELSE 0 END), 0)::numeric(10,2) AS ingresos_pagados
    FROM peliculas p
    LEFT JOIN funciones f ON f.pelicula_id = p.id
    LEFT JOIN tickets t ON t.funcion_id = f.id
    LEFT JOIN ventas v ON v.id = t.venta_id
    WHERE p.id = $1
    GROUP BY p.id, p.titulo
  `, [peliculaId]);
  return result.rows[0] || { pelicula_id: peliculaId, titulo: null, cantidad_tickets: 0, cantidad_activos: 0, cantidad_usados: 0, cantidad_anulados: 0, ingresos_pagados: 0 };
}

async function getDetalleFuncionesPorPelicula(peliculaId) {
  const result = await query(`
    SELECT f.id, f.fecha, f.hora_inicio, f.hora_fin, s.nombre AS sala,
           COUNT(t.id)::int AS entradas_vendidas
    FROM funciones f
    JOIN salas s ON s.id = f.sala_id
    LEFT JOIN tickets t ON t.funcion_id = f.id AND t.estado != 'ANULADO'
    WHERE f.pelicula_id = $1
    GROUP BY f.id, s.nombre
    ORDER BY f.fecha, f.hora_inicio
  `, [peliculaId]);
  return result.rows;
}

module.exports = { getResumen, getVentasPorPelicula, getReportePorPelicula, getDetalleFuncionesPorPelicula };
