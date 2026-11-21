const db = require('../config/db');

function normalizar(row) {
  return row ? { ...row, precio: Number(row.precio) } : undefined;
}

async function listar(categoria) {
  const q = categoria
    ? 'SELECT * FROM productos WHERE lower(categoria) = lower($1) ORDER BY id ASC'
    : 'SELECT * FROM productos ORDER BY id ASC';
  const { rows } = await db.query(q, categoria ? [categoria] : []);
  return rows.map(normalizar);
}

async function obtener(id) {
  const { rows } = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
  return normalizar(rows[0]);
}

// Aporte de Ricardo: CRUD de productos con consultas SQL parametrizadas.
async function crear(p) {
  const { rows } = await db.query(
    `INSERT INTO productos
     (nombre, descripcion, categoria, precio)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [p.nombre, p.descripcion, p.categoria, p.precio]
  );
  return normalizar(rows[0]);
}

async function actualizar(id, p) {
  const { rows } = await db.query(
    `UPDATE productos
     SET nombre = $2,
         descripcion = $3,
         categoria = $4,
         precio = $5,
         fecha_actualizacion = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, p.nombre, p.descripcion, p.categoria, p.precio]
  );
  return normalizar(rows[0]);
}

async function eliminar(id) {
  const { rows } = await db.query(
    'DELETE FROM productos WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0];
}

// Express importa estos cinco metodos desde los controladores.
module.exports = { listar, obtener, crear, actualizar, eliminar };
