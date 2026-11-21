const test = require('node:test');
const assert = require('node:assert/strict');
const { validarProducto, validarRegistro, idEntero } = require('../src/utils/validaciones');
test('producto valido normaliza datos', () => {
  const r = validarProducto({ nombre:' Teclado ', descripcion:' Prueba ', categoria:' Accesorios ', precio:12.5 });
  assert.equal(r.nombre, 'Teclado');
  assert.equal(r.precio, 12.5);
});
test('rechaza precio cero, negativo, texto y mas de dos decimales', () => {
  for (const precio of [0, -5, '10', 1.234]) {
    assert.throws(() => validarProducto({nombre:'A', descripcion:'B', categoria:'C', precio}));
  }
});
test('validaciones del usuario y email', () => {
  assert.throws(() => validarRegistro({ nombre:'Ana', correo:'invalido', password:'Clave12345' }));
  assert.equal(validarRegistro({nombre:' Ana ', correo:'A@Ejemplo.com', password:'Clave12345'}).correo, 'a@ejemplo.com');
});
test('solo ID entero positivo', () => {
  assert.equal(idEntero('1'), 1);
  for (const id of ['0','-2','abc','1.5','1e2','999999999999','2147483648','']) assert.throws(() => idEntero(id));
});

test('no permite productos incompletos y textos vacios', () => {
  for (const body of [null, [], {}, {nombre:'', descripcion:'ok', categoria:'ok', precio:2}, {nombre:'ok', descripcion:' ', categoria:'ok', precio:2}]) {
    assert.throws(() => validarProducto(body));
  }
});
test('rechaza el registro de cuentas con claves y correos invalidos', () => {
  for (const body of [{nombre:'', correo:'a@b.com', password:'password1'}, {nombre:'Ana', correo:'a@b.com', password:'123'}, {nombre:'Ana', correo:'sin-correo', password:'password1'}]) {
    assert.throws(() => validarRegistro(body));
  }
});
test('ID de JSON y de ruta admiten solo enteros positivos', () => {
  assert.equal(idEntero(1), 1);
  assert.equal(idEntero('45'), 45);
  assert.throws(() => idEntero(0));
  assert.throws(() => idEntero('1e3'));
  assert.throws(() => idEntero(2.3));
});
