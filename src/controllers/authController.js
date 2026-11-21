const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../repositories/usuariosRepo');
const { validarRegistro, correoValido } = require('../utils/validaciones');
const { fallar } = require('../utils/errores');
async function registro(req, res) {
  const { nombre, correo, password } = validarRegistro(req.body);
  if (await repo.obtenerPorCorreo(correo)) fallar(409, 'CORREO_DUPLICADO', 'El correo ya esta registrado.');
  const hash = await bcrypt.hash(password, 12);
  const usuario = await repo.crear(nombre, correo, hash);
  // El rol recibido en JSON se ignora: el registro publico SIEMPRE crea 'usuario'.
  return res.status(201).json({ mensaje: 'Usuario registrado.', usuario });
}
async function login(req, res) {
  if (!correoValido(req.body?.correo) || typeof req.body?.password !== 'string') {
    fallar(400, 'DATOS_INVALIDOS', 'correo y password son obligatorios.');
  }
  const usuario = await repo.obtenerPorCorreo(req.body.correo.trim().toLowerCase());
  const esValido = usuario && await bcrypt.compare(req.body.password, usuario.password_hash);
  if (!esValido) fallar(401, 'CREDENCIALES_INVALIDAS', 'Correo o contrasena incorrectos.');
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: 'HS256', subject: String(usuario.id), expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
  return res.status(200).json({
    mensaje: 'Inicio de sesion correcto.', token, tipo: 'Bearer',
    usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
  });
}
module.exports = { registro, login };
