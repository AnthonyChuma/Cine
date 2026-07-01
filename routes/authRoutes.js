const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateMiddleware = require('../middleware/validateMiddleware');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/login', (req, res) => res.render('login', { title: 'Iniciar sesión', error: null, user: req.user || null }));
router.post('/login', loginLimiter, authController.loginValidators, validateMiddleware, authController.login);
router.post('/api/auth/login', loginLimiter, authController.loginValidators, validateMiddleware, authController.login);
router.get('/registro', (req, res) => res.render('registro', { title: 'Registro', error: null, user: req.user || null }));
router.post('/registro', [
  body('nombre').notEmpty().trim(),
  body('apellido').notEmpty().trim(),
  body('correo').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], validateMiddleware, authController.register);
router.post('/api/auth/register', [
  body('nombre').notEmpty().trim(),
  body('apellido').notEmpty().trim(),
  body('correo').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], validateMiddleware, authController.register);
router.post('/logout', authController.logout);
router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/me', authController.me);

module.exports = router;
