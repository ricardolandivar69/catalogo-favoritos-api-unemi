# Video tecnico en parejas - propuesta 12 minutos

Se requiere que AMBOS integrantes participen y comprendan todo. Esta es una guia de organizacion, NO un guion para fingir trabajo realizado.

| Minutos | Responsable propuesto | Mostrar y explicar |
|---|---|---|
| 0:00-1:00 | Ricardo Landivar | Presentacion, objetivo y arquitectura: Express, PG, carpetas |
| 1:00-2:30 | Mariana Reyes | Tres tablas SQL, relaciones, UNIQUE de correo y favoritos, ON DELETE CASCADE |
| 2:30-4:00 | Ricardo Landivar | Codigo: authController registro/login, bcrypt hash y JWT con vencimiento |
| 4:00-5:30 | Mariana Reyes | Codigo: autenticar middleware, verificar firma/exp, soloAdministrador y favoritos filtrados por token |
| 5:30-7:00 | Ricardo Landivar | Postman registro, login, admin CRUD y filtro |
| 7:00-8:45 | Mariana Reyes | Favoritos A y B: A agrega, B no ve, B no borra, A conserva |
| 8:45-10:00 | Ricardo Landivar | Pruebas errores: 400, 401 sin token/expirado, 403, 404, 409 |
| 10:00-11:00 | Mariana Reyes | Reiniciar Node, comprobar persistencia en Postman y pgAdmin |
| 11:00-12:00 | Ambos | Problema real encontrado y solucion, clonar, npm install, SQL, .env local, scripts, npm run dev, repositorio |

**Preparar antes de grabar:** dos cuentas ficticias A y B, admin de script local, cinco productos semilla; tener abiertas VS Code, Postman, pgAdmin y GitHub. Aumentar zoom del editor y ocultar el .env, tokens, contrasenas y hashes.

**Flujo de una peticion explicado a detalle:** Postman envia `POST /api/productos` con JSON + Bearer. Express ejecuta ruta, middleware verifica JWT y rol actual en BD, controller valida producto, repository usa consulta parametrizada, PostgreSQL lo guarda y la respuesta devuelve JSON `201`.

**Dificultad real:** no inventar un error. Registrar un problema que efectivamente aparecio, como configuracion de PG, migracion de tablas o manejo de token vencido, y describir su solucion comprobable.

La entrega pide un video 10-15 minutos con audio claro y participacion de ambos, no 5 minutos ni solo demostracion de interfaz.
