const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.home);
router.get('/cartelera', publicController.cartelera);
router.get('/pelicula/:id', publicController.mostrarDetalle);
router.get('/api/public/peliculas', publicController.apiPeliculas);
router.get('/api/public/funciones', publicController.apiFunciones);

module.exports = router;
