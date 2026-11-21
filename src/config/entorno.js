require('dotenv').config();

const obligatorio = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
function comprobarConfiguracion() {
  const faltantes = obligatorio.filter((clave) => !process.env[clave]);
  if (faltantes.length) {
    throw new Error('Completa estas variables en .env: ' + faltantes.join(', '));
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres aleatorios.');
  }
}
module.exports = { comprobarConfiguracion };
