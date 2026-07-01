function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).render('no-autorizado', {
        title: 'No autorizado',
        user: req.user
      });
    }

    return next();
  };
}

module.exports = { authorizeRoles };
