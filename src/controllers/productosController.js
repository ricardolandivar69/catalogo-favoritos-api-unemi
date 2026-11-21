const repo = require('../repositories/productosRepo');
const { idEntero, validarProducto } = require('../utils/validaciones');
const { fallar } = require('../utils/errores');
async function listar(req, res) {
  const categoria = req.query.categoria;
  if (categoria !== undefined && (typeof categoria !== 'string' || !categoria.trim() || categoria.trim().length > 80)) {
    fallar(400, 'CATEGORIA_INVALIDA', 'categoria debe ser texto no vacio.');
  }
  const productos = await repo.listar(categoria ? categoria.trim() : undefined);
  res.json({ total: productos.length, productos });
}
async function obtener(req, res) {
  const producto = await repo.obtener(idEntero(req.params.id));
  if (!producto) fallar(404, 'PRODUCTO_NO_EXISTE', 'Producto no encontrado.');
  res.json({ producto });
}
async function crear(req, res) {
  const producto = await repo.crear(validarProducto(req.body));
  res.status(201).json({ mensaje: 'Producto creado.', producto });
}
async function actualizar(req, res) {
  const producto = await repo.actualizar(idEntero(req.params.id), validarProducto(req.body));
  if (!producto) fallar(404, 'PRODUCTO_NO_EXISTE', 'Producto no encontrado.');
  res.json({ mensaje: 'Producto actualizado.', producto });
}
async function eliminar(req, res) {
  const eliminado = await repo.eliminar(idEntero(req.params.id));
  if (!eliminado) fallar(404, 'PRODUCTO_NO_EXISTE', 'Producto no encontrado.');
  res.json({ mensaje: 'Producto eliminado. Sus favoritos asociados tambien fueron eliminados.', id: eliminado.id });
}
module.exports = { listar, obtener, crear, actualizar, eliminar };
