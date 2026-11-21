const jwt = require('jsonwebtoken');
const { comprobarConfiguracion } = require('../src/config/entorno');
const { idEntero } = require('../src/utils/validaciones');
try {
  comprobarConfiguracion();
  const usuarioId = idEntero(process.argv[2] || '1', 'usuarioId');
  const token = jwt.sign({}, process.env.JWT_SECRET, { algorithm: 'HS256', subject: String(usuarioId), expiresIn: -60 });
  console.log('Token firmado y ya vencido para probar 401. Usar solo localmente:');
  console.log(token);
} catch (err) { console.error(err.message); process.exitCode = 1; }
