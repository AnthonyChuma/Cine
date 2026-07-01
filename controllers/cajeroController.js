const funcionModel = require('../models/funcionModel');
const ticketModel = require('../models/ticketModel');
const ventaModel = require('../models/ventaModel');
const { body } = require('express-validator');

const ventaValidators = [
  body('funcionId').isInt({ min: 1 }),
  body('asientoId').isInt({ min: 1 })
];

async function caja(req, res) {
  res.render('caja', { title: 'Caja', user: req.user || null });
}

async function venta(req, res, next) {
  try {
    const funciones = await funcionModel.getFunciones();
    res.render('caja-venta', { title: 'Venta presencial', funciones, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function validarTicket(req, res) {
  res.render('caja-validar-ticket', { title: 'Validar ticket', user: req.user || null });
}

async function procesarVenta(req, res, next) {
  try {
    const { funcionId, asientoId, clienteCorreo } = req.body;
    const funcion = await funcionModel.getFuncionById(funcionId);
    const codigoUnico = `CAJA-${Date.now()}`;
    const ticket = await ticketModel.createTicket({ usuarioId: 1, funcionId, asientoId, codigoUnico, total: funcion.precio });
    const venta = await ventaModel.createVenta({ usuarioId: 1, cajeroId: req.user.id, total: funcion.precio, metodoPago: 'EFECTIVO' });
    await ventaModel.createDetalleVenta({ ventaId: venta.id, ticketId: ticket.id, precioUnitario: funcion.precio });
    res.redirect('/caja/validar-ticket');
  } catch (error) {
    next(error);
  }
}

module.exports = { caja, venta, validarTicket, procesarVenta, ventaValidators };
