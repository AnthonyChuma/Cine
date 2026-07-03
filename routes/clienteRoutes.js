const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

router.get('/comprar/:funcionId', authorizeRoles('CLIENTE'), clienteController.comprar);
router.post('/comprar/:funcionId', authorizeRoles('CLIENTE'), clienteController.compraValidators, validateMiddleware, clienteController.procesarCompra);
router.get('/pago/:ventaId', authorizeRoles('CLIENTE'), clienteController.pagoTicket);
router.post('/pago/:ventaId/confirmar', authorizeRoles('CLIENTE'), clienteController.confirmarPago);
router.get('/mis-tickets', authorizeRoles('CLIENTE'), clienteController.misTickets);

module.exports = router;
