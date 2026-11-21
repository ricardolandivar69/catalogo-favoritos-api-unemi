const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../src/config/db');
const favoritos = require('../src/repositories/favoritosRepo');

test('cada usuario consulta sus propios favoritos', async (t) => {
  const parametros = [];
  t.mock.method(db, 'query', async (sql, values) => {
    assert.match(sql, /WHERE f\.usuario_id = \$1/);
    parametros.push(values);
    return {
      rows: values[0] === 7
        ? [{ producto_id: 11, nombre: 'Mouse', precio: '12.50' }]
        : []
    };
  });

  const deA = await favoritos.listar(7);
  const deB = await favoritos.listar(8);
  assert.deepEqual(parametros, [[7], [8]]);
  assert.equal(deA.length, 1);
  assert.equal(deA[0].precio, 12.5);
  assert.deepEqual(deB, []);
});

test('agregar favorito asocia producto y usuario correctamente', async (t) => {
  t.mock.method(db, 'query', async (sql, values) => {
    assert.match(sql, /INSERT INTO favoritos/);
    assert.deepEqual(values, [7, 11]);
    return { rows: [{ producto_id: 11 }] };
  });
  const guardado = await favoritos.agregar(7, 11);
  assert.equal(guardado.producto_id, 11);
});

test('no se repite un favorito ya registrado', async (t) => {
  t.mock.method(db, 'query', async (sql, values) => {
    assert.match(sql, /ON CONFLICT \(usuario_id, producto_id\) DO NOTHING/);
    assert.deepEqual(values, [7, 11]);
    return { rows: [] };
  });
  assert.equal(await favoritos.agregar(7, 11), null);
});

test('eliminar usa el usuario propietario y rechaza registros ajenos', async (t) => {
  t.mock.method(db, 'query', async (sql, values) => {
    assert.match(sql, /WHERE usuario_id = \$1 AND producto_id = \$2/);
    if (values[0] === 8) return { rows: [] };
    return { rows: [{ producto_id: 11 }] };
  });
  assert.deepEqual(await favoritos.eliminar(7, 11), { producto_id: 11 });
  assert.equal(await favoritos.eliminar(8, 11), null);
});