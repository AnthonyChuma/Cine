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
    WHERE t.estado IN ('ACTIVO', 'USADO')
      AND v.estado = 'COMPLETADA'
    GROUP BY p.id, p.titulo
    ORDER BY entradas_vendidas DESC
  `);
  return result.rows;
}

module.exports = { getResumen, getVentasPorPelicula };
