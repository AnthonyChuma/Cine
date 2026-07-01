const peliculaModel = require('../models/peliculaModel');
const funcionModel = require('../models/funcionModel');
const reporteModel = require('../models/reporteModel');
const { query } = require('../models/db');

async function admin(req, res, next) {
  try {
    const resumen = await reporteModel.getResumen();
    res.render('admin', { title: 'Panel admin', resumen, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function adminPeliculas(req, res, next) {
  try {
    const peliculas = await peliculaModel.getPeliculas();
    res.render('admin-peliculas', { title: 'Administrar películas', peliculas, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function adminFunciones(req, res, next) {
  try {
    const funciones = await funcionModel.getFunciones();
    res.render('admin-funciones', { title: 'Administrar funciones', funciones, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function adminUsuarios(req, res, next) {
  try {
    const result = await query('SELECT u.id, u.nombre, u.apellido, u.correo, r.nombre AS rol, u.estado FROM usuarios u JOIN roles r ON r.id = u.rol_id ORDER BY u.id');
    res.render('admin-usuarios', { title: 'Usuarios', usuarios: result.rows, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function adminReportes(req, res, next) {
  try {
    const resumen = await reporteModel.getResumen();
    res.render('admin-reportes', { title: 'Reportes', resumen, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function crearPelicula(req, res, next) {
  try {
    await peliculaModel.createPelicula(req.body);
    res.redirect('/admin/peliculas');
  } catch (error) {
    next(error);
  }
}

async function editarPelicula(req, res, next) {
  try {
    await peliculaModel.updatePelicula(req.params.id, req.body);
    res.redirect('/admin/peliculas');
  } catch (error) {
    next(error);
  }
}

async function eliminarPelicula(req, res, next) {
  try {
    await peliculaModel.deletePelicula(req.params.id);
    res.redirect('/admin/peliculas');
  } catch (error) {
    next(error);
  }
}

async function crearFuncion(req, res, next) {
  try {
    await funcionModel.createFuncion(req.body);
    res.redirect('/admin/funciones');
  } catch (error) {
    next(error);
  }
}

async function editarFuncion(req, res, next) {
  try {
    await funcionModel.updateFuncion(req.params.id, req.body);
    res.redirect('/admin/funciones');
  } catch (error) {
    next(error);
  }
}

async function eliminarFuncion(req, res, next) {
  try {
    await funcionModel.deleteFuncion(req.params.id);
    res.redirect('/admin/funciones');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  admin,
  adminPeliculas,
  adminFunciones,
  adminUsuarios,
  adminReportes,
  crearPelicula,
  editarPelicula,
  eliminarPelicula,
  crearFuncion,
  editarFuncion,
  eliminarFuncion
};
