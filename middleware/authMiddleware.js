const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    res.locals.user = decoded;
    return next();
  } catch (error) {
    res.clearCookie('token');
    req.user = null;
    res.locals.user = null;
    return next();
  }
}

module.exports = authMiddleware;
