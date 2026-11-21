const jwt = require('jsonwebtoken');
const { fallar, asyncRuta } = require('../utils/errores');
const usuarios = require('../repositories/usuariosRepo');
const autenticar = asyncRuta(async (req, res, next) => {
  const cabecera = req.get('authorization') || '';
  if (!/^Bearer\s+\S+$/i.test(cabecera)) {
    fallar(401, 'TOKEN_REQUERIDO', 'Se requiere token Bearer.');
  }
  let datos;
  try {
    datos = jwt.verify(cabecera.replace(/^Bearer\s+/i, ''), process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (e) {
    fallar(401, 'TOKEN_INVALIDO', e.name === 'TokenExpiredError' ? 'El token ha vencido.' : 'Token invalido.');
  }
  const id = Number(datos.sub);
  if (!Number.isSafeInteger(id) || id <= 0) fallar(401, 'TOKEN_INVALIDO', 'Token invalido.');
  const usuario = await usuarios.obtenerPorId(id);
  if (!usuario) fallar(401, 'USUARIO_NO_EXISTE', 'La cuenta ya no existe.');
  req.usuario = { id: usuario.id, rol: usuario.rol };
  next();
});
const soloAdministrador = (req, res, next) => {
  if (req.usuario?.rol !== 'administrador') {
    return res.status(403).json({ error: { codigo: 'PROHIBIDO', mensaje: 'Solo el administrador puede modificar productos.' } });
  }
  next();
};
module.exports = { autenticar, soloAdministrador };
