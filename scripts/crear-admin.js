const bcrypt = require('bcryptjs');
const { comprobarConfiguracion } = require('../src/config/entorno');
const { correoValido } = require('../src/utils/validaciones');
async function ejecutar() {
  comprobarConfiguracion();
  const correo = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const nombre = (process.env.ADMIN_NOMBRE || 'Administrador de pruebas').trim();
  if (!correoValido(correo) || password.length < 8 || password.length > 72 || !nombre) {
    throw new Error('Configura ADMIN_NOMBRE, ADMIN_EMAIL y ADMIN_PASSWORD en .env antes de continuar.');
  }
  const db = require('../src/config/db');
  try {
    const existe = await db.query('SELECT id FROM usuarios WHERE correo = $1', [correo]);
    if (existe.rowCount) throw new Error('Ya existe una cuenta con ese correo. No se modifico el rol.');
    const hash = await bcrypt.hash(password, 12);
    await db.query('INSERT INTO usuarios(nombre, correo, password_hash, rol) VALUES($1, $2, $3, $4)',
      [nombre, correo, hash, 'administrador']);
    console.log('Administrador creado. El password y su hash no se muestran.');
  } finally { await db.end(); }
}
ejecutar().catch(err => { console.error(err.message); process.exitCode = 1; });
