const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..', 'postman');
const collection = JSON.parse(fs.readFileSync(path.join(root, 'Catalogo_Favoritos_Postman.json'), 'utf8'));
const environment = JSON.parse(fs.readFileSync(path.join(root, 'Catalogo_Favoritos_Entorno_EJEMPLO.json'), 'utf8'));
const items = collection.item;

test('coleccion Postman incluye 34 pruebas con aserciones', () => {
  assert.equal(items.length, 34);
  for (const item of items) {
    assert.ok(item.request?.method, item.name);
    assert.ok(item.request?.url, item.name);
    const testScript = (item.event || []).find(x => x.listen === 'test');
    assert.ok(testScript?.script?.exec?.join('\n').includes('pm.response.to.have.status'), item.name);
  }
});
test('la coleccion cubre todas las rutas de la guia', () => {
  const routes = new Set(items.map(it => `${it.request.method} ${typeof it.request.url==='string' ? it.request.url : it.request.url.raw}`.replace(/\{\{baseUrl\}\}/g, '')));
  for (const r of [
    'POST /api/auth/registro', 'POST /api/auth/login', 'GET /api/productos',
    'GET /api/productos/{{productoId}}', 'POST /api/productos',
    'PUT /api/productos/{{productoId}}', 'DELETE /api/productos/{{productoId}}',
    'GET /api/favoritos', 'POST /api/favoritos', 'DELETE /api/favoritos/{{productoId}}'
  ]) assert.ok(routes.has(r), `Ruta faltante: ${r}`);
});
test('el entorno exportado no contiene contrasenas, credenciales o JWT', () => {
  for (const item of environment.values) {
    if (/password|token|secret|email|correoA|correoB|idA|idB|productoId|idSemilla/i.test(item.key)) {
      assert.equal(item.value, '', `No dejar un secreto o dato de prueba en ${item.key}`);
    }
  }
});

test('los scripts de Postman tienen sintaxis JavaScript valida', () => {
  for (const item of items) {
    for (const evento of item.event || []) {
      const script = (evento.script?.exec || []).join('\n');
      assert.doesNotThrow(() => new vm.Script(script), `${item.name} / ${evento.listen}`);
    }
  }
});
