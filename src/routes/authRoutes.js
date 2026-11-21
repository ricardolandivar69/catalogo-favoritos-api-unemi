const router = require('express').Router();
const c = require('../controllers/authController');
const { asyncRuta } = require('../utils/errores');
router.post('/registro', asyncRuta(c.registro));
router.post('/login', asyncRuta(c.login));
module.exports = router;
