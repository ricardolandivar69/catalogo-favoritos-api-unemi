// SEED V2: consultas separadas para evitar inferencias ambiguas del parametro $1.
const { comprobarConfiguracion } = require('../src/config/entorno');

const ejemplos = [
  ['Laptop Lenovo IdeaPad 3', 'Laptop de prueba con 16 GB de RAM', 'Computacion', 720.00],
  ['Monitor Dell 24', 'Monitor Full HD para oficina', 'Computacion', 165.50],
  ['Teclado Logitech K120', 'Teclado USB de uso general', 'Accesorios', 14.90],
  ['Mouse HP 150', 'Mouse optico USB', 'Accesorios', 9.75],
  ['Silla ergonomica', 'Silla para escritorio', 'Oficina', 110.00]
];

async function ejecutar() {
  comprobarConfiguracion();
  const db = require('../src/config/db');
  let insertados = 0;
  let existentes = 0;

  try {
    console.log('[SEED V2] Iniciando carga de productos...');

    for (const [nombre, descripcion, categoria, precio] of ejemplos) {
      // Consulta de comprobacion independiente: $1 solo se usa como texto.
      const previo = await db.query(
        'SELECT id FROM productos WHERE nombre = $1 LIMIT 1',
        [nombre]
      );

      if (previo.rows.length > 0) {
        existentes++;
        continue;
      }

      // Consulta de insercion independiente: los tipos se obtienen de las columnas.
      await db.query(
        'INSERT INTO productos (nombre, descripcion, categoria, precio) VALUES ($1, $2, $3, $4)',
        [nombre, descripcion, categoria, precio]
      );
      insertados++;
    }

    const conteo = await db.query('SELECT COUNT(*)::integer AS total FROM productos');
    console.log(`[SEED V2] Productos nuevos: ${insertados}; previamente existentes: ${existentes}.`);
    console.log(`[SEED V2] Productos totales en la tabla: ${conteo.rows[0].total}.`);
    console.log('[SEED V2] Carga finalizada correctamente.');
  } finally {
    await db.end();
  }
}

ejecutar().catch((err) => {
  console.error('[SEED V2] Error:', err.message);
  process.exitCode = 1;
});
