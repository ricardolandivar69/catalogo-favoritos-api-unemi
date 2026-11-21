# Mapa de requisitos de la guía Tarea 2

Este documento relaciona cada requisito con los archivos concretos del proyecto.
Los resultados de ejecución reales deben verificarse en PostgreSQL y Postman.

| Requisito | Implementación | Evidencia que falta realizar en Windows |
|---|---|---|
| Node.js/Express y JSON | `server.js`, `src/app.js`, `src/routes/` | Servidor escuchando en puerto 3002 |
| PostgreSQL relacional real | `src/config/db.js`, `database/02_esquema.sql` | Consultas desde pgAdmin |
| Usuarios correo único, hash, rol | tabla `usuarios`, `authController.js` | Alta y comprobación SQL sin hash visible |
| Productos y precio positivo | tabla `productos`, `productosController.js` | CRUD 200/201 y 400 en Postman |
| Favoritos sin duplicados | PK compuesta `favoritos`, `favoritosController.js` | A agrega y duplicado 409 |
| JWT firmado y caducidad | `src/middleware/autenticar.js`, `authController.js` | 401 sin token y vencido |
| Registro público solo rol usuario | `usuariosRepo.js` | Postman caso 04 intenta rol admin y obtiene usuario |
| Administrador único para cambios | `scripts/crear-admin.js`, `soloAdministrador` | Postman 403 usuario normal, 201 admin |
| Catálogo público con filtro | `productosController.js`, `productosRepo.js` | Casos 01-03 Postman |
| Aislamiento de usuarios A y B | `favoritosRepo.js` usa `req.usuario.id` | Casos 22-25 Postman |
| Eliminación consistente | clave foránea `ON DELETE CASCADE` | Casos 27-30 y consulta SQL |
| Persistencia tras reiniciar Node | PostgreSQL, no estado en memoria | Casos 33-34 tras Ctrl+C y reinicio |
| Validaciones y respuestas coherentes | `src/utils/validaciones.js`, `errores.js` | 400/401/403/404/409 |
| Tests automatizados | `tests/`, colección `postman/` | `npm test` y Postman Test Results |
| Script datos de prueba | `scripts/cargar-productos.js` | Cinco productos visibles en SQL |
| README, secretos de ejemplo y lock | `README.md`, `.env.example`, `package-lock.json` | Instalar desde copia limpia |
| Colaboración real | `docs/COORDINACION_PAREJA.md` | Commits reales con Ricardo y Mariana |
| GitHub, video, PDF | `docs/PLANTILLA_ENTREGA.md` | **Etapa posterior**, no afirmar que están realizados |
