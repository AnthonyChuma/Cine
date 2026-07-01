const { query } = require('./db');

async function getResumen() {
  const [ventas, tickets, usuarios, peliculas] = await Promise.all([
    query('SELECT COALESCE(SUM(total),0) AS total FROM ventas'),
    query('SELECT COUNT(*)::int AS total FROM tickets'),
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

module.exports = { getResumen };
