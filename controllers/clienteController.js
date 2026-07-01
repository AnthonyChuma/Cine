const peliculaModel = require('../models/peliculaModel');
const funcionModel = require('../models/funcionModel');
const ticketModel = require('../models/ticketModel');
const ventaModel = require('../models/ventaModel');
const { body } = require('express-validator');

const compraValidators = [
  body('funcionId').isInt({ min: 1 }),
  body('asientoId').isInt({ min: 1 })
];

async function comprar(req, res, next) {
  try {
    const funcion = await funcionModel.getFuncionById(req.params.funcionId);
    res.render('comprar-ticket', { title: 'Comprar ticket', funcion, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function procesarCompra(req, res, next) {
  try {
    const { funcionId, asientoId } = req.body;
    const id = funcionId || req.params.funcionId;
    const funcion = await funcionModel.getFuncionById(id);
    if (!funcion) {
      return res.status(404).render('error', { title: 'Función no encontrada', message: 'No existe la función solicitada.', user: req.user || null });
    }
    const codigoUnico = `TKT-${Date.now()}`;
    const ticket = await ticketModel.createTicket({ usuarioId: req.user.id, funcionId: id, asientoId, codigoUnico, total: funcion.precio });
    const venta = await ventaModel.createVenta({ usuarioId: req.user.id, cajeroId: null, total: funcion.precio, metodoPago: 'EFECTIVO' });
    await ventaModel.createDetalleVenta({ ventaId: venta.id, ticketId: ticket.id, precioUnitario: funcion.precio });
    return res.redirect('/mis-tickets');
  } catch (error) {
    next(error);
  }
}

async function misTickets(req, res, next) {
  try {
    const tickets = await ticketModel.getTicketsByUsuario(req.user.id);
    res.render('mis-tickets', { title: 'Mis tickets', tickets, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

module.exports = { comprar, procesarCompra, misTickets, compraValidators };
