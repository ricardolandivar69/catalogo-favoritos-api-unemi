const db = require('../config/db');
async function crear(nombre, correo, passwordHash) {
  const { rows } = await db.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, 'usuario')
     RETURNING id, nombre, correo, rol, fecha_registro`,
    [nombre, correo, passwordHash]
  );
  return rows[0];
}
async function obtenerPorCorreo(correo) {
  const { rows } = await db.query('SELECT id, nombre, correo, password_hash, rol FROM usuarios WHERE correo = $1', [correo]);
  return rows[0];
}
async function obtenerPorId(id) {
  const { rows } = await db.query('SELECT id, rol FROM usuarios WHERE id = $1', [id]);
  return rows[0];
}
module.exports = { crear, obtenerPorCorreo, obtenerPorId };
