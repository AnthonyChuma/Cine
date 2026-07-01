const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/admin', authorizeRoles('ADMIN'), adminController.admin);
router.get('/admin/peliculas', authorizeRoles('ADMIN'), adminController.adminPeliculas);
router.post('/admin/peliculas', authorizeRoles('ADMIN'), adminController.crearPelicula);
router.post('/admin/peliculas/:id/editar', authorizeRoles('ADMIN'), adminController.editarPelicula);
router.post('/admin/peliculas/:id/eliminar', authorizeRoles('ADMIN'), adminController.eliminarPelicula);
router.get('/admin/funciones', authorizeRoles('ADMIN'), adminController.adminFunciones);
router.post('/admin/funciones', authorizeRoles('ADMIN'), adminController.crearFuncion);
router.post('/admin/funciones/:id/editar', authorizeRoles('ADMIN'), adminController.editarFuncion);
router.post('/admin/funciones/:id/eliminar', authorizeRoles('ADMIN'), adminController.eliminarFuncion);
router.get('/admin/usuarios', authorizeRoles('ADMIN'), adminController.adminUsuarios);
router.get('/admin/reportes', authorizeRoles('ADMIN'), adminController.adminReportes);

module.exports = router;
