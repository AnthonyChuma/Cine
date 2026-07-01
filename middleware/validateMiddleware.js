const { validationResult } = require('express-validator');

function validateMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('error', {
      title: 'Datos inválidos',
      message: 'Revisa los campos enviados.',
      user: req.user || null
    });
  }
  return next();
}

module.exports = validateMiddleware;
