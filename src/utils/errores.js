class ErrorHttp extends Error {
  constructor(estado, codigo, mensaje, detalles) {
    super(mensaje);
    this.estado = estado;
    this.codigo = codigo;
    if (detalles) this.detalles = detalles;
  }
}
function fallar(estado, codigo, mensaje, detalles) {
  throw new ErrorHttp(estado, codigo, mensaje, detalles);
}
function asyncRuta(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
function noEncontrada(req, res) {
  res.status(404).json({ error: { codigo: 'RUTA_NO_ENCONTRADA', mensaje: 'Ruta no encontrada.' } });
}
function manejador(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err instanceof ErrorHttp) {
    return res.status(err.estado).json({ error: {
      codigo: err.codigo, mensaje: err.message,
      ...(err.detalles ? { detalles: err.detalles } : {})
    } });
  }
  if (err.code === '23505') {
    return res.status(409).json({ error: { codigo: 'DUPLICADO', mensaje: 'Ese dato ya existe.' } });
  }
  if (err.code === '23503') {
    return res.status(404).json({ error: { codigo: 'REFERENCIA_NO_EXISTE', mensaje: 'El recurso relacionado no existe.' } });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { codigo: 'JSON_INVALIDO', mensaje: 'El cuerpo JSON no es valido.' } });
  }
  // No mostrar SQL, cadenas de conexion, claves o stack traces al cliente.
  console.error('Error interno:', err.message);
  return res.status(500).json({ error: { codigo: 'ERROR_INTERNO', mensaje: 'Ocurrio un error en el servidor.' } });
}
module.exports = { ErrorHttp, fallar, asyncRuta, noEncontrada, manejador };
