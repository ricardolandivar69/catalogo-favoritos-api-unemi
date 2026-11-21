
# Catalogo de productos con favoritos y acceso por roles

API REST para la tarea de Desarrollo Web de UNEMI, creada con **Node.js 20+, Express, PostgreSQL (`pg`), bcryptjs y JWT**. La API solo maneja JSON: la guia indica que la interfaz grafica es opcional y no suma puntos.

## Integrantes

- Ricardo Landivar
- Mariana Reyes

## Que hace

1. Registra usuarios normales; contrasenas con hash bcrypt (12 rondas) y correo unico.
2. Hace login y devuelve JWT firmado HS256, con vencimiento (por defecto 1 hora).
3. Permite consultar productos publicamente, con filtro `?categoria=Computacion`.
4. Permite que **solo** el administrador haga POST, PUT y DELETE sobre productos.
5. Guarda favoritos de cada usuario autenticado sin duplicados ni acceso cruzado.
6. Conserva datos tras reiniciar Node.js. Al eliminar un producto, PostgreSQL elimina sus relaciones de favoritos mediante `ON DELETE CASCADE`.

## Por que elegimos PostgreSQL

PostgreSQL maneja claves foraneas, `UNIQUE`, transacciones y persistencia real. Las consultas usan parametros `$1`, `$2` en lugar de concatenar entradas del usuario. Los tres conjuntos de datos son `usuarios`, `productos` y `favoritos`.

```text
usuarios (1) --- (N) favoritos (N) --- (1) productos
```

## Instalacion en Windows (paso a paso)

1. Instala Node.js 20+ y PostgreSQL 15+ (pgAdmin). En VS Code abre esta carpeta.
2. En pgAdmin, selecciona la base `postgres`, abre **Query Tool** y ejecuta `database/01_crear_base.sql`. Si la base ya existe, no repitas `CREATE DATABASE`.
3. Abre **Query Tool** desde `catalogo_favoritos_db` y ejecuta `database/02_esquema.sql`.
4. En VS Code copia `.env.example` como `.env`. Escribe la contrasena local de PostgreSQL en `DB_PASSWORD`.
5. Genera un secreto aleatorio en terminal:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Coloca ese resultado en `JWT_SECRET` dentro de `.env`. **No lo compartas ni lo subas a GitHub**.
6. Para crear el admin, define en tu `.env` **un correo ficticio de administrador** y una clave de prueba fuerte bajo `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Este script solo se ejecuta localmente:

   ```powershell
   npm ci
   npm run db:seed
   npm run db:admin
   npm run dev
   ```

7. `package-lock.json` ya viene incluido en el proyecto y fija las dependencias. En una instalacion limpia puedes usar `npm ci`; si lo deseas, `npm install` tambien funciona. No hace falta instalar `nodemon`: `npm run dev` utiliza el modo observacion incluido en Node.js 20+.
8. El servidor escuchara en `http://localhost:3002`. Prueba `http://localhost:3002/api/productos` para ver cinco productos.

Si falla la conexion, revisa puerto 5432, usuario, clave y nombre de base. **Nunca muestres el contenido de `.env` en capturas o video.**

## Rutas y permisos

Todas las rutas empiezan por `/api`.

| Metodo | Ruta | Permiso | Funcion |
|---|---|---|---|
| POST | `/auth/registro` | Publico | Crear usuario con rol `usuario` siempre |
| POST | `/auth/login` | Publico | Login y JWT con vencimiento |
| GET | `/productos` | Publico | Listar y filtrar por `categoria` |
| GET | `/productos/:id` | Publico | Consultar un producto |
| POST | `/productos` | Administrador | Registrar producto |
| PUT | `/productos/:id` | Administrador | Reemplazar ficha completa |
| DELETE | `/productos/:id` | Administrador | Borrar producto y favoritos vinculados |
| GET | `/favoritos` | Usuario autenticado | Consultar SOLO sus favoritos |
| POST | `/favoritos` | Usuario autenticado | Agregar favorito |
| DELETE | `/favoritos/:productoId` | Usuario autenticado | Quitar SOLO su favorito |

### Cuerpos JSON de ejemplo

**Registro publico:**

```json
{"nombre":"Ana Prueba","correo":"ana123@example.com","password":"ClaveDePrueba123!","rol":"administrador"}
```

Aunque un cliente intente pedir `administrador`, el servidor siempre guarda `rol: "usuario"` en el registro publico. Las claves y hashes no se devuelven en JSON.

**Login:**

```json
{"correo":"ana123@example.com","password":"ClaveDePrueba123!"}
```

**Producto (POST y PUT):**

```json
{"nombre":"Mouse USB","descripcion":"Mouse de ejemplo","categoria":"Accesorios","precio":12.50}
```

En `PUT` se requieren todos los campos del producto. `precio` debe ser numero positivo con maximo dos decimales.

**Favoritos:**

```json
{"productoId":1}
```

No uses `usuarioId` en el cuerpo: se obtiene del token firmado y luego se verifica en la BD. Un favorito eliminado usa `DELETE /api/favoritos/1` y no afecta los favoritos de otros.

### Respuestas HTTP

- `200`: lectura, login, actualizacion o eliminacion completada (retorna JSON).
- `201`: creacion de usuario, producto o favorito.
- `400`: entrada invalida (identificador, precio, campos, correo, JSON).
- `401`: credenciales invalidas, token ausente, alterado o vencido.
- `403`: usuario normal intenta modificar el catalogo.
- `404`: producto o favorito de la cuenta no encontrado.
- `409`: correo o favorito duplicado.

Formato general de error: `{"error":{"codigo":"...","mensaje":"..."}}`. Las consultas no devuelven detalles internos ni secretos.

## Postman: importar y ejecutar

1. Importa `postman/Catalogo_Favoritos_Postman.json`.
2. Importa `postman/Catalogo_Favoritos_Entorno_EJEMPLO.json`; selecciona el entorno en la esquina superior derecha.
3. En el entorno configura **localmente** `adminEmail`, `adminPassword`, `passwordA` y `passwordB`. Usa dos contrasenas de prueba ficticias de 8+ caracteres. Deja `correoA` y `correoB` vacios: la coleccion generara correos ficticios con marca de tiempo.
4. Ejecuta las peticiones **en orden**. Los tests guardan tokens e IDs temporalmente en el entorno. Observa `Test Results` junto al cuerpo de cada respuesta.
5. Para verificar JWT **realmente vencido**, luego de registrar a Ana ejecuta:

   ```powershell
   npm run test:token-expirado -- 1
   ```

   En vez de `1`, utiliza el `idA` que devuelve Postman. Copia el token **vencido** que imprime la terminal al campo `tokenVencido` del entorno y ejecuta la peticion **32**. No sirve poner texto aleatorio para probar expiracion.
6. Para comprobar persistencia, **apaga** Node con Ctrl+C y ejecuta otra vez `npm run dev`. Luego ejecuta las peticiones **33 y 34**; debe existir el producto semilla y el usuario A registrado.
7. **No exportes ni subas** el entorno editado durante las pruebas, porque contendra contrasenas y tokens. Solo se publica el archivo `...EJEMPLO.json` con campos de secretos en blanco.

La coleccion incluye 34 casos con aserciones de estado y JSON. Consulta `docs/PLAN_DE_PRUEBAS.md` para reunir evidencia real. Cada prueba debe ejecutarse; no afirmes que paso si no la ejecutaste.

## Estructura

```text
catalogo_favoritos_api/
  database/             01_crear_base.sql, 02_esquema.sql
  postman/              coleccion y entorno sin secretos
  scripts/              inicializacion admin, datos, token de prueba vencido
  src/config/           entorno y conexion pg
  src/repositories/     consultas SQL parametrizadas
  src/controllers/      logica de los endpoints
  src/middleware/       autenticacion y verificacion de rol
  src/routes/           rutas Express
  src/utils/            validaciones y errores HTTP
  tests/                pruebas unitarias sin PostgreSQL
  server.js             arranque y prueba de conexion
```

## Tests automaticos de validaciones

```powershell
npm test
```

Los tests con `node:test` prueban las funciones de validacion localmente; no reemplazan las 34 pruebas de Postman conectadas a PostgreSQL.

## Preparacion para GitHub y entrega (etapa posterior)

- Crea un **repositorio nuevo y publico**, distinto al de la practica NEXA-TIC anterior.
- Publica `package.json`, `package-lock.json`, scripts SQL, `.env.example`, Postman y README. Nunca `node_modules`, `.env`, claves o tokens.
- Conserva el historial de commits **reales** de ambas personas; no inventes aportes.
- El video dura 10-15 minutos y **ambos** deben explicar codigo propio, JWT, permisos, propiedad, flujo completo de peticiones, reinicio y problemas solucionados.
- Cada persona entrega el mismo PDF llamado `Entrega_Catalogo_Apellido1_Apellido2.pdf`, incluyendo: nombres, link del repo, link del video, hash del commit final, resumen de aportes y tabla de pruebas con esperado y obtenido.
- Verifica enlaces en ventana privada y que el codigo del video corresponda al commit publicado.
- Consulta `docs/GUIA_VIDEO_10_A_15_MIN.md` para la distribucion sugerida.


## Comprobaciones antes de grabar o publicar

- Ejecutar `npm test` (tests unitarios y de estructura de Postman; **no sustituyen la prueba con PostgreSQL**).
- Ejecutar las 34 peticiones reales de Postman y completar `docs/PLAN_DE_PRUEBAS.md` con resultados y capturas; la prueba del token vencido requiere una accion manual documentada.
- En pgAdmin verificar la persistencia de `usuarios`, `productos` y `favoritos` y la eliminacion por cascada.
- Las dos personas deben modificar codigo y crear commits reales propios (no basta con aparecer en el video).
- El proyecto **no se ha ejecutado contra el PostgreSQL de tu laptop** en el momento de empaquetarlo. Esa validacion la haremos contigo paso a paso.
- Para repartir el trabajo de manera autentica consultar `docs/COORDINACION_PAREJA.md`.

### Solucion a problemas frecuentes

- **No conecta a PostgreSQL:** revisar que PostgreSQL este encendido, base `catalogo_favoritos_db`, puerto 5432, y los cinco valores `DB_*` del `.env` (no compartir el archivo).
- **Puerto 3002 en uso:** cambiar `PORT` en `.env` y `baseUrl` en Postman.
- **401 Token vencido:** hacer login otra vez. El token realmente vencido se prueba con `npm run test:token-expirado -- 2`, reemplazando 2 por `idA`.
- **403 al crear productos:** el usuario normal no tiene permisos; iniciar sesion con el admin creado por el script.
- **409 correo duplicado en Postman:** limpiar `correoA` y `correoB` del entorno y ejecutar de nuevo los registros, o elegir correos nuevos.
- **No se cargan los cinco ejemplos:** ejecutar `npm run db:seed` con PostgreSQL y `.env` configurados.
- **Para volver a ejecutar toda la coleccion:** limpia `correoA`, `correoB`, `tokenA`, `tokenB`, `tokenAdmin`, `productoId`, `tokenVencido`, `idA`, `idB` del entorno; conserva contrasenas y email administrador solo en tu equipo.
