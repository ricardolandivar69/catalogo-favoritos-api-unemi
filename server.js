const { comprobarConfiguracion } = require('./src/config/entorno');
async function iniciar() {
  comprobarConfiguracion();
  const db = require('./src/config/db');
  await db.query('SELECT 1');
  const app = require('./src/app');
  const puerto = Number(process.env.PORT || 3002);
  app.listen(puerto, () => console.log(`Catalogo API: http://localhost:${puerto}/api`));
}
iniciar().catch((err) => {
  console.error('No se pudo iniciar: ', err.message);
  process.exitCode = 1;
});
