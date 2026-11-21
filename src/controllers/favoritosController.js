const repo = require('../repositories/favoritosRepo');
const productos = require('../repositories/productosRepo');
const { idEntero } = require('../utils/validaciones');
const { fallar } = require('../utils/errores');
async function listar(req, res) {
  const favoritos = await repo.listar(req.usuario.id);
  res.json({ total: favoritos.length, favoritos });
}
async function agregar(req, res) {
  const productoId = idEntero(req.body?.productoId, 'productoId');
  if (!await productos.obtener(productoId)) fallar(404, 'PRODUCTO_NO_EXISTE', 'Producto no encontrado.');
  const favorito = await repo.agregar(req.usuario.id, productoId);
  if (!favorito) fallar(409, 'FAVORITO_DUPLICADO', 'El producto ya esta en tus favoritos.');
  res.status(201).json({ mensaje: 'Favorito agregado.', favorito });
}
async function eliminar(req, res) {
  const productoId = idEntero(req.params.productoId, 'productoId');
  const eliminado = await repo.eliminar(req.usuario.id, productoId);
  if (!eliminado) fallar(404, 'FAVORITO_NO_EXISTE', 'Ese favorito no pertenece a tu cuenta o no existe.');
  res.json({ mensaje: 'Favorito eliminado.', productoId });
}
module.exports = { listar, agregar, eliminar };
