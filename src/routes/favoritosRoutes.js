const router = require('express').Router();
const c = require('../controllers/favoritosController');
const { asyncRuta } = require('../utils/errores');
const { autenticar } = require('../middleware/autenticar');
router.use(autenticar);
router.get('/', asyncRuta(c.listar));
router.post('/', asyncRuta(c.agregar));
router.delete('/:productoId', asyncRuta(c.eliminar));
module.exports = router;
