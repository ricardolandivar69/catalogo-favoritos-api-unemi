# Plan de pruebas reales (reemplazar Pendiente solo despues de ejecutar)

Esta tabla sirve de control durante las demostraciones. La guia exige resultados **obtenidos**, no solo esperados.

| Caso | Respuesta esperada | Resultado obtenido | Evidencia |
|---|---|---|---|
| Registro normal | 201, rol usuario, sin hash | Pendiente | Captura Postman |
| Registro correo duplicado | 409 | Pendiente | Captura Postman |
| Login correcto | 200 + JWT | Pendiente | Ocultar token en captura |
| Login incorrecto | 401 | Pendiente | Captura Postman |
| Catalogo y filtro | 200 + 5 productos, categoria correcta | Pendiente | Captura Postman |
| Administrador crea, edita y elimina | 201, 200, 200 | Pendiente | Capturas Postman |
| Precio / campos invalidos | 400 | Pendiente | Captura Postman |
| Producto inexistente | 404 | Pendiente | Captura Postman |
| Sin token | 401 | Pendiente | Captura Postman |
| Token realmente vencido | 401 | Pendiente | Script local + captura |
| Usuario intenta modificar producto | 403 | Pendiente | Captura Postman |
| Agrega / lista / quita favorito | 201, 200, 200 | Pendiente | Capturas Postman |
| Favorito duplicado | 409 | Pendiente | Captura Postman |
| Favorito de producto inexistente | 404 | Pendiente | Captura Postman |
| B no ve ni elimina favorito de A | 200 vacio; 404; favorito de A permanece | Pendiente | Capturas de A y B |
| Borrado producto mantiene relaciones consistentes | 200 y favorito desaparece por CASCADE | Pendiente | Captura Postman/SQL |
| Reiniciar Node; productos/usuarios siguen | 200 | Pendiente | Terminal antes y despues + Postman |

**Formato de error:** 400 se usa para validacion de datos; 401 no autenticado; 403 rol prohibido; 404 recurso inaccesible/no existe; 409 conflicto por duplicacion.

## Comandos SQL para las pruebas visuales

En pgAdmin abre la base `catalogo_favoritos_db` y ejecuta:

```sql
SELECT id, nombre, correo, rol FROM usuarios ORDER BY id;
SELECT id, nombre, categoria, precio FROM productos ORDER BY id;
SELECT usuario_id, producto_id, fecha_agregado FROM favoritos ORDER BY usuario_id, producto_id;
```

**No consultes `password_hash` en capturas del video ni PDF.**
