const funcionModel = require('../models/funcionModel');
const ticketModel = require('../models/ticketModel');
const ventaModel = require('../models/ventaModel');
const pagoModel = require('../models/pagoModel');
const asientoModel = require('../models/asientoModel');
const { body } = require('express-validator');

const compraValidators = [
  body('funcionId').isInt({ min: 1 }),
  body('asientoId').custom((value) => {
    if (!value) {
      throw new Error('Seleccione al menos un asiento.');
    }
    const ids = Array.isArray(value) ? value : [value];
    if (!ids.every((item) => Number.isInteger(Number(item)) && Number(item) > 0)) {
      throw new Error('Los asientos deben ser valores numéricos válidos.');
    }
    return true;
  }),
  body('metodo_pago').isIn(['QR', 'TARJETA'])
];

async function comprar(req, res, next) {
  try {
    const funcion = await funcionModel.getFuncionById(req.params.funcionId);
    if (!funcion || funcion.estado !== 'PROGRAMADA') {
      return res.status(404).render('error', { title: 'Función no encontrada', message: 'Función no disponible.', user: req.user || null });
    }
    const asientos = await asientoModel.getAsientosByFuncion(funcion.id);
    res.render('comprar-ticket', { title: 'Comprar ticket', funcion, asientos, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function procesarCompra(req, res, next) {
  try {
    const { funcionId, asientoId, metodo_pago } = req.body;
    const id = Number(funcionId || req.params.funcionId);
    const funcion = await funcionModel.getFuncionById(id);
    if (!funcion || funcion.estado !== 'PROGRAMADA') {
      return res.status(404).render('error', { title: 'Función no encontrada', message: 'No existe la función solicitada.', user: req.user || null });
    }

    const asientoIds = Array.isArray(asientoId) ? asientoId.map(Number) : [Number(asientoId)];
    const uniqueAsientos = [...new Set(asientoIds)].filter((id) => Number.isInteger(id) && id > 0);
    if (!uniqueAsientos.length) {
      return res.status(400).render('error', { title: 'Asiento inválido', message: 'Selecciona al menos un asiento válido.', user: req.user || null });
    }

    const asientos = await Promise.all(uniqueAsientos.map((idAsiento) => asientoModel.getAsientoById(idAsiento)));
    if (asientos.some((a) => !a)) {
      return res.status(400).render('error', { title: 'Asiento inválido', message: 'Uno o más asientos seleccionados no existen.', user: req.user || null });
    }

    const occupied = [];
    for (const asiento of asientos) {
      const existingTicket = await ticketModel.getTicketByFuncionAsiento(id, asiento.id);
      if (existingTicket) {
        occupied.push(asiento.codigo_asiento);
      }
    }
    if (occupied.length > 0) {
      return res.status(409).render('error', { title: 'Asientos ocupados', message: `Los siguientes asientos ya no están disponibles: ${occupied.join(', ')}.`, user: req.user || null });
    }

    const total = Number(funcion.precio) * uniqueAsientos.length;
    const venta = await ventaModel.createVenta({ usuarioId: req.user.id, cajeroId: null, total, metodoPago: metodo_pago, estado: metodo_pago === 'QR' ? 'PENDIENTE' : 'COMPLETADA' });
    const tickets = [];
    for (const asiento of asientos) {
      const codigoTicket = `TKT-${Date.now()}-${asiento.codigo_asiento}`;
      const ticket = await ticketModel.createTicket({ usuarioId: req.user.id, funcionId: id, asientoId: asiento.id, ventaId: venta.id, codigoUnico: codigoTicket, total: funcion.precio });
      await ventaModel.createDetalleVenta({ ventaId: venta.id, ticketId: ticket.id, precioUnitario: funcion.precio });
      tickets.push(ticket);
    }

    await pagoModel.createPago({ ventaId: venta.id, metodoPago: metodo_pago, monto: total, referenciaPago: metodo_pago === 'QR' ? `QR-${Date.now()}` : null, estado: metodo_pago === 'QR' ? 'PENDIENTE' : 'PAGADO' });

    if (metodo_pago === 'QR') {
      return res.redirect(`/pago/${venta.id}`);
    }

    return res.redirect('/mis-tickets');
  } catch (error) {
    next(error);
  }
}

async function pagoTicket(req, res, next) {
  try {
    const venta = await ventaModel.getVentaById(Number(req.params.ventaId));
    if (!venta || venta.usuario_id !== req.user.id) {
      return res.status(404).render('error', { title: 'Venta no encontrada', message: 'No existe la venta solicitada.', user: req.user || null });
    }
    const pago = await pagoModel.getPagoByVentaId(venta.id);
    const tickets = await ticketModel.getTicketsByVentaId(venta.id);
    if (!pago) {
      return res.status(400).render('error', { title: 'Pago no encontrado', message: 'No existe el pago asociado.', user: req.user || null });
    }
    return res.render('pago-ticket', { title: 'Pago de ticket', venta, pago, tickets, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function confirmarPago(req, res, next) {
  try {
    const venta = await ventaModel.getVentaById(Number(req.params.ventaId));
    if (!venta || venta.usuario_id !== req.user.id) {
      return res.status(404).render('error', { title: 'Venta no encontrada', message: 'No existe la venta solicitada.', user: req.user || null });
    }

    const pago = await pagoModel.getPagoByVentaId(venta.id);
    if (!pago) {
      return res.status(400).render('error', { title: 'Pago no encontrado', message: 'No existe el pago asociado.', user: req.user || null });
    }

    await pagoModel.updatePagoEstado(pago.id, 'PAGADO');
    await ventaModel.updateVentaEstado(venta.id, 'COMPLETADA');
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

module.exports = { comprar, procesarCompra, pagoTicket, confirmarPago, misTickets, compraValidators };
