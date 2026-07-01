const express = require('express');
const router = express.Router();
const cajeroController = require('../controllers/cajeroController');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

router.get('/caja', authorizeRoles('CAJERO', 'ADMIN'), cajeroController.caja);
router.get('/caja/venta', authorizeRoles('CAJERO', 'ADMIN'), cajeroController.venta);
router.post('/caja/venta', authorizeRoles('CAJERO', 'ADMIN'), cajeroController.ventaValidators, validateMiddleware, cajeroController.procesarVenta);
router.get('/caja/validar-ticket', authorizeRoles('CAJERO', 'ADMIN'), cajeroController.validarTicket);

module.exports = router;
