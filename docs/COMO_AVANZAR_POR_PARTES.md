# Desarrollo por etapas (base, no entrega final)

## Etapa 0: instalación sin grabar secretos
- pgAdmin: database/01_crear_base.sql desde postgres; database/02_esquema.sql desde catalogo_favoritos_db.
- Crear .env local desde .env.example sin exponer su contenido.
- npm ci, npm test, npm run db:seed, npm run db:admin, npm run dev.
- GET http://localhost:3002/api/productos debe responder cinco productos.

## Etapa 1: Ricardo
- Estudiar `src/routes/productosRoutes.js`, `src/controllers/productosController.js` y `src/repositories/productosRepo.js`.
- Implementar tres funciones TODO con consultas parametrizadas.
- Comprobar POST 201, PUT 200 y DELETE 200 con usuario admin; sin JWT 401 y usuario normal 403.
- Consultar datos desde pgAdmin. Commit propio identificado en GitHub.

## Etapa 2: Mariana
- Estudiar middleware JWT y `src/controllers/favoritosController.js`.
- Implementar dos funciones TODO en `src/repositories/favoritosRepo.js`.
- Probar favoritos: A agrega 201; duplicado 409; B no puede ver ni quitar los de A.
- Verificar borrado en cascada y persistencia. Commit propio identificado en GitHub.

## Etapa 3: verificación completa
- Importar la colección y el entorno EJEMPLO de Postman, guardar los secretos solo en la copia local del entorno.
- Ejecutar las 34 solicitudes y registrar resultados reales, incluyendo token vencido y reinicio.
- Grabar una explicacion tecnica conjunta de 10 a 15 minutos (aprox 5 por persona).
- Subir codigo público, video accesible y el mismo PDF de entrega para los dos.

Nota: este proyecto contiene funciones incompletas a propósito. No debe presentarse como código final.
