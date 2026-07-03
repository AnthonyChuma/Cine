const peliculaModel = require('../models/peliculaModel');
const funcionModel = require('../models/funcionModel');
const asientoModel = require('../models/asientoModel');

async function home(req, res, next) {
  try {
    const peliculas = await peliculaModel.getPeliculas();
    res.render('home', { title: 'Cine Hispano', peliculas, user: req.user || null });
  } catch (error) {
    next(error);
  }
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
    const pelicula = await peliculaModel.getPeliculaActivaVigenteById(req.params.id);
    if (!pelicula) {
      return res.status(404).render('error', { title: 'Película no disponible', message: 'La película no se encuentra vigente.', user: req.user || null });
    }
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

async function apiAsientosPorFuncion(req, res, next) {
  try {
    const { funcionId } = req.params;
    const asientos = await asientoModel.getAsientosByFuncion(Number(funcionId));
    res.json(asientos);
  } catch (error) {
    next(error);
  }
}

module.exports = { home, cartelera, mostrarDetalle, apiPeliculas, apiFunciones, apiAsientosPorFuncion };
