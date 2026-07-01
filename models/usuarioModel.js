const bcrypt = require('bcryptjs');
const { query } = require('./db');

async function findByEmail(email) {
  const result = await query(
    'SELECT u.id, u.nombre, u.apellido, u.correo, u.password_hash, u.estado, u.fecha_creacion, r.nombre AS rol FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.correo = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function createUser({ nombre, apellido, correo, password, rol = 'CLIENTE' }) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const roleResult = await query('SELECT id FROM roles WHERE nombre = $1', [rol]);
  if (roleResult.rows.length === 0) {
    throw new Error('Rol no válido');
  }
  const roleId = roleResult.rows[0].id;
  const result = await query(
    'INSERT INTO usuarios (nombre, apellido, correo, password_hash, estado, fecha_creacion, rol_id) VALUES ($1, $2, $3, $4, $5, NOW(), $6) RETURNING id',
    [nombre, apellido, correo, passwordHash, 'ACTIVO', roleId]
  );
  return result.rows[0];
}

async function comparePassword(candidate, hash) {
  return bcrypt.compare(candidate, hash);
}

module.exports = { findByEmail, createUser, comparePassword };
