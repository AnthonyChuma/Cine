function errorMiddleware(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: process.env.NODE_ENV === 'production' ? 'Ocurrió un error inesperado.' : err.message,
    user: req.user || null
  });
}

module.exports = errorMiddleware;
