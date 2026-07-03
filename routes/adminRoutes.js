const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

router.get('/admin', authorizeRoles('ADMIN'), adminController.admin);
router.get('/admin/salas', authorizeRoles('ADMIN'), adminController.adminSalas);
router.get('/admin/salas/nueva', authorizeRoles('ADMIN'), adminController.nuevaSala);
router.get('/admin/salas/:id/editar', authorizeRoles('ADMIN'), adminController.editarSalaFormulario);
router.post('/admin/salas', authorizeRoles('ADMIN'), [
  body('nombre').notEmpty().trim(),
  body('filas').isInt({ min: 1 }),
  body('columnas').isInt({ min: 1 }),
  body('estado').optional().isIn(['ACTIVA', 'INACTIVA'])
], validateMiddleware, adminController.crearSala);
router.post('/admin/salas/:id/editar', authorizeRoles('ADMIN'), [
  body('nombre').notEmpty().trim(),
  body('filas').isInt({ min: 1 }),
  body('columnas').isInt({ min: 1 }),
  body('estado').optional().isIn(['ACTIVA', 'INACTIVA'])
], validateMiddleware, adminController.editarSala);
router.get('/admin/salas/:id/asientos', authorizeRoles('ADMIN'), adminController.verAsientosSala);
router.post('/admin/salas/:id/asientos/generar', authorizeRoles('ADMIN'), adminController.generarAsientosSala);

router.get('/admin/peliculas', authorizeRoles('ADMIN'), adminController.adminPeliculas);
router.get('/admin/peliculas/nueva', authorizeRoles('ADMIN'), adminController.nuevaPelicula);
router.post('/admin/peliculas', authorizeRoles('ADMIN'), [
  body('titulo').notEmpty().trim(),
  body('duracion_minutos').isInt({ min: 1 }),
  body('clasificacion').notEmpty().trim(),
  body('fecha_inicio_vigencia').isDate(),
  body('fecha_fin_vigencia').optional().isDate(),
  body('sala_id').isInt({ min: 1 }),
  body('precio').isFloat({ min: 0 })
], validateMiddleware, adminController.crearPelicula);
router.post('/admin/peliculas/:id/eliminar', authorizeRoles('ADMIN'), adminController.eliminarPelicula);
router.post('/admin/peliculas/:id/funciones-mensuales', authorizeRoles('ADMIN'), [
  body('fecha_inicio_vigencia').isDate(),
  body('fecha_fin_vigencia').optional().isDate(),
  body('sala_id').isInt({ min: 1 }),
  body('precio').isFloat({ min: 0 })
], validateMiddleware, adminController.generarFuncionesMensuales);

router.get('/admin/funciones', authorizeRoles('ADMIN'), adminController.adminFunciones);
router.post('/admin/funciones', authorizeRoles('ADMIN'), adminController.crearFuncion);
router.post('/admin/funciones/:id/editar', authorizeRoles('ADMIN'), adminController.editarFuncion);
router.post('/admin/funciones/:id/eliminar', authorizeRoles('ADMIN'), adminController.eliminarFuncion);
router.get('/admin/usuarios', authorizeRoles('ADMIN'), adminController.adminUsuarios);
router.get('/admin/reportes', authorizeRoles('ADMIN'), adminController.adminReportes);
router.get('/admin/reportes/pelicula', authorizeRoles('ADMIN'), adminController.adminReportesPorPelicula);

module.exports = router;
