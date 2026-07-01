const peliculaModel = require('../models/peliculaModel');
const funcionModel = require('../models/funcionModel');

async function home(req, res) {
  res.render('home', { title: 'Cine Hispano', user: req.user || null });
}

async function cartelera(req, res, next) {
  try {
    const peliculas = await peliculaModel.getPeliculas();
    res.render('cartelera', { title: 'Cartelera', peliculas, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function mostrarDetalle(req, res, next) {
  try {
    const pelicula = await peliculaModel.getPeliculaById(req.params.id);
    const funciones = await funcionModel.getFuncionesPorPelicula(req.params.id);
    res.render('detalle-pelicula', { title: 'Detalle', pelicula, funciones, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function apiPeliculas(req, res, next) {
  try {
    const peliculas = await peliculaModel.getPeliculas();
    res.json(peliculas);
  } catch (error) {
    next(error);
  }
}

async function apiFunciones(req, res, next) {
  try {
    const funciones = await funcionModel.getFunciones();
    res.json(funciones);
  } catch (error) {
    next(error);
  }
}

module.exports = { home, cartelera, mostrarDetalle, apiPeliculas, apiFunciones };
