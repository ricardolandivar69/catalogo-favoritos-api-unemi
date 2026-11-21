-- Tarea 2: evidencias visuales de persistencia en pgAdmin.
-- Abrir Query Tool conectado a catalogo_favoritos_db.
-- NUNCA seleccionar password_hash para capturas o video.

-- Usuarios registrados y sus roles, sin contrasenas:
SELECT id, nombre, correo, rol, fecha_registro FROM usuarios ORDER BY id;

-- Al menos cinco productos de ejemplo:
SELECT id, nombre, categoria, precio FROM productos ORDER BY id;

-- Favoritos de cada usuario (para demostrar aislamiento):
SELECT f.usuario_id, f.producto_id, p.nombre AS producto, f.fecha_agregado
FROM favoritos f
JOIN productos p ON p.id = f.producto_id
ORDER BY f.usuario_id, f.producto_id;

-- Comprobar filtro por categoria:
SELECT id, nombre, categoria, precio
FROM productos
WHERE lower(categoria) = lower('Computacion')
ORDER BY id;

-- Eliminar un producto desde API y repetir la consulta de favoritos.
-- Gracias a la FK ON DELETE CASCADE no quedaran relaciones huerfanas.
