const db = require('../config/db');

// Cada consulta usa el usuarioId obtenido del JWT verificado por Express.
async function listar(usuarioId) {
  const { rows } = await db.query(
    `SELECT f.producto_id, f.fecha_agregado, p.nombre, p.descripcion, p.categoria, p.precio
     FROM favoritos f
     INNER JOIN productos p ON p.id = f.producto_id
     WHERE f.usuario_id = $1
     ORDER BY f.fecha_agregado DESC, f.producto_id DESC`,
    [usuarioId]
  );
  return rows.map((row) => ({ ...row, precio: Number(row.precio) }));
}

// Un mismo usuario no puede guardar el mismo producto dos veces.
async function agregar(usuarioId, productoId) {
  const { rows } = await db.query(
    `INSERT INTO favoritos (usuario_id, producto_id)
     VALUES ($1, $2)
     ON CONFLICT (usuario_id, producto_id) DO NOTHING
     RETURNING producto_id, fecha_agregado`,
    [usuarioId, productoId]
  );
  return rows[0] ?? null;
}

// El usuario solo puede eliminar sus propios favoritos.
async function eliminar(usuarioId, productoId) {
  const { rows } = await db.query(
    `DELETE FROM favoritos
     WHERE usuario_id = $1 AND producto_id = $2
     RETURNING producto_id`,
    [usuarioId, productoId]
  );
  return rows[0] ?? null;
}

module.exports = { listar, agregar, eliminar };
