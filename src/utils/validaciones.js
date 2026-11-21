const { fallar } = require('./errores');
const correoValido = (c) => typeof c === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.trim()) && c.trim().length <= 254;
function idEntero(valor, nombre = 'id') {
  // Acepta IDs numéricos del JSON o cifras decimales en la URL, pero no '1e2', '1.5' ni '01abc'.
  const normalizado = typeof valor === 'string' ? valor.trim() : valor;
  if (typeof normalizado === 'string' && !/^[1-9]\d*$/.test(normalizado)) {
    fallar(400, 'ID_INVALIDO', `${nombre} debe ser un entero positivo.`);
  }
  const numero = Number(normalizado);
  if (!Number.isSafeInteger(numero) || numero <= 0 || numero > 2147483647) {
    fallar(400, 'ID_INVALIDO', `${nombre} debe ser un entero positivo.`);
  }
  return numero;
}
function textoObligatorio(valor, nombre, max = 120) {
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > max) {
    fallar(400, 'DATOS_INVALIDOS', `${nombre} es obligatorio y debe tener como maximo ${max} caracteres.`);
  }
  return valor.trim();
}
function validarProducto(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    fallar(400, 'DATOS_INVALIDOS', 'Se requiere un objeto JSON.');
  }
  const nombre = textoObligatorio(body.nombre, 'nombre');
  const descripcion = textoObligatorio(body.descripcion, 'descripcion', 500);
  const categoria = textoObligatorio(body.categoria, 'categoria', 80);
  const precio = body.precio;
  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio <= 0 || precio > 9999999999.99 || Math.round(precio * 100) / 100 !== precio) {
    fallar(400, 'PRECIO_INVALIDO', 'precio debe ser un numero positivo de hasta dos decimales.');
  }
  return { nombre, descripcion, categoria, precio };
}
function validarRegistro(body) {
  const nombre = textoObligatorio(body?.nombre, 'nombre', 100);
  if (!correoValido(body?.correo)) fallar(400, 'CORREO_INVALIDO', 'Ingresa un correo valido.');
  if (typeof body?.password !== 'string' || body.password.length < 8 || body.password.length > 72) {
    fallar(400, 'PASSWORD_INVALIDO', 'La contrasena debe tener entre 8 y 72 caracteres.');
  }
  return { nombre, correo: body.correo.trim().toLowerCase(), password: body.password };
}
module.exports = { idEntero, textoObligatorio, validarProducto, validarRegistro, correoValido };
