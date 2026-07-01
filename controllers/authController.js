const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const usuarioModel = require('../models/usuarioModel');

const loginValidators = [
  body('correo').isEmail().normalizeEmail(),
  body('password').notEmpty().trim()
];

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

async function login(req, res, next) {
  try {
    const { correo, password } = req.body;
    const user = await usuarioModel.findByEmail(correo);
    if (!user || !await usuarioModel.comparePassword(password, user.password_hash)) {
      if (req.path === '/api/auth/login' || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      return res.status(401).render('login', { title: 'Iniciar sesión', error: 'Credenciales inválidas', user: null });
    }

    const token = jwt.sign({ id: user.id, correo: user.correo, rol: user.rol }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
    res.cookie('token', token, cookieOptions);

    if (req.path === '/api/auth/login' || req.headers.accept?.includes('application/json')) {
      return res.json({ ok: true, user: { id: user.id, correo: user.correo, rol: user.rol }, redirect: user.rol === 'ADMIN' ? '/admin' : user.rol === 'CAJERO' ? '/caja' : '/cartelera' });
    }

    if (user.rol === 'ADMIN') return res.redirect('/admin');
    if (user.rol === 'CAJERO') return res.redirect('/caja');
    return res.redirect('/cartelera');
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { nombre, apellido, correo, password } = req.body;
    await usuarioModel.createUser({ nombre, apellido, correo, password, rol: 'CLIENTE' });
    return res.redirect('/login');
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.clearCookie('token', cookieOptions);
  return res.redirect('/login');
}

function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { login, register, logout, me, loginValidators };
