const peliculaModel = require('../models/peliculaModel');
const funcionModel = require('../models/funcionModel');
const reporteModel = require('../models/reporteModel');
const salaModel = require('../models/salaModel');
const { query } = require('../models/db');

async function admin(req, res, next) {
  try {
    const resumen = await reporteModel.getResumen();
    res.render('admin', { title: 'Panel admin', resumen, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function adminSalas(req, res, next) {
  try {
    const salas = await salaModel.getSalas();
    res.render('admin-salas', { title: 'Administrar salas', salas, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function nuevaSala(req, res, next) {
  try {
    res.render('admin-sala-form', { title: 'Nueva sala', user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function crearSala(req, res, next) {
  try {
    const sala = await salaModel.createSala(req.body);
    res.redirect(`/admin/salas/${sala.id}/asientos`);
  } catch (error) {
    next(error);
  }
}

async function verAsientosSala(req, res, next) {
  try {
    const sala = await salaModel.getSalaById(req.params.id);
    if (!sala) {
      return res.status(404).render('error', { title: 'Sala no encontrada', message: 'No existe la sala solicitada.', user: req.user || null });
    }
    const asientos = await salaModel.getAsientosBySala(sala.id);
    res.render('admin-sala-asientos', { title: `Asientos ${sala.nombre}`, sala, asientos, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function generarAsientosSala(req, res, next) {
  try {
    const sala = await salaModel.getSalaById(req.params.id);
    if (!sala) {
      return res.status(404).render('error', { title: 'Sala no encontrada', message: 'No existe la sala solicitada.', user: req.user || null });
    }

    const hasSeats = await salaModel.hasAsientos(sala.id);
    if (hasSeats) {
      return res.status(400).render('error', { title: 'Asientos existentes', message: 'La sala ya tiene asientos generados.', user: req.user || null });
    }

    await salaModel.generateAsientosForSala(sala.id, sala.filas, sala.columnas);
    res.redirect(`/admin/salas/${sala.id}/asientos`);
  } catch (error) {
    next(error);
  }
}

async function adminPeliculas(req, res, next) {
  try {
    const peliculas = await peliculaModel.getPeliculasAdmin();
    const salas = await salaModel.getSalas();
    res.render('admin-peliculas', { title: 'Administrar películas', peliculas, salas, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function nuevaPelicula(req, res, next) {
  try {
    const salas = await salaModel.getSalas();
    res.render('admin-pelicula-form', { title: 'Nueva película', salas, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function editarSalaFormulario(req, res, next) {
  try {
    const sala = await salaModel.getSalaById(req.params.id);
    if (!sala) {
      return res.status(404).render('error', { title: 'Sala no encontrada', message: 'No existe la sala solicitada.', user: req.user || null });
    }
    res.render('admin-sala-form', { title: 'Editar sala', sala, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function editarSala(req, res, next) {
  try {
    await salaModel.updateSala(req.params.id, req.body);
    res.redirect('/admin/salas');
  } catch (error) {
    next(error);
  }
}

async function activarSala(req, res, next) {
  try {
    await salaModel.updateSalaEstado(req.params.id, 'ACTIVA');
    res.redirect('/admin/salas');
  } catch (error) {
    next(error);
  }
}

async function inactivarSala(req, res, next) {
  try {
    await salaModel.updateSalaEstado(req.params.id, 'INACTIVA');
    res.redirect('/admin/salas');
  } catch (error) {
    next(error);
  }
}

async function crearPelicula(req, res, next) {
  try {
    const pelicula = await peliculaModel.createPelicula(req.body);
    if (req.body.sala_id) {
      await funcionModel.generarFuncionesMensuales({
        pelicula_id: pelicula.id,
        sala_id: req.body.sala_id,
        fecha_inicio_vigencia: req.body.fecha_inicio_vigencia,
        fecha_fin_vigencia: req.body.fecha_fin_vigencia,
        precio: req.body.precio
      });
    }
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

async function activarPelicula(req, res, next) {
  try {
    await peliculaModel.activatePelicula(req.params.id);
    res.redirect('/admin/peliculas');
  } catch (error) {
    next(error);
  }
}

async function generarFuncionesMensuales(req, res, next) {
  try {
    await funcionModel.generarFuncionesMensuales({
      pelicula_id: req.body.pelicula_id,
      sala_id: req.body.sala_id,
      fecha_inicio_vigencia: req.body.fecha_inicio_vigencia,
      fecha_fin_vigencia: req.body.fecha_fin_vigencia,
      precio: req.body.precio
    });
    res.redirect('/admin/funciones');
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
    const peliculas = await peliculaModel.getPeliculasAdmin();
    res.render('admin-reportes', { title: 'Reportes', resumen, peliculas, reportePorPelicula: null, detalleFunciones: [], pelicula_id: null, user: req.user || null });
  } catch (error) {
    next(error);
  }
}

async function adminReportesPorPelicula(req, res, next) {
  try {
    const peliculaId = Number(req.query.pelicula_id);
    const peliculas = await peliculaModel.getPeliculasAdmin();
    if (!peliculaId || Number.isNaN(peliculaId)) {
      const resumen = await reporteModel.getResumen();
      return res.render('admin-reportes', { title: 'Reporte por película', resumen, peliculas, reportePorPelicula: null, detalleFunciones: [], pelicula_id: null, user: req.user || null });
    }
    const reporte = await reporteModel.getReportePorPelicula(peliculaId);
    const detalleFunciones = await reporteModel.getDetalleFuncionesPorPelicula(peliculaId);
    const resumen = await reporteModel.getResumen();
    res.render('admin-reportes', { title: 'Reporte por película', resumen, peliculas, reportePorPelicula: reporte, detalleFunciones, pelicula_id: peliculaId, user: req.user || null });
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
  adminSalas,
  nuevaSala,
  crearSala,
  editarSalaFormulario,
  editarSala,
  verAsientosSala,
  generarAsientosSala,
  adminPeliculas,
  nuevaPelicula,
  crearPelicula,
  editarPelicula,
  eliminarPelicula,
  generarFuncionesMensuales,
  adminFunciones,
  adminUsuarios,
  adminReportes,
  adminReportesPorPelicula,
  crearFuncion,
  editarFuncion,
  eliminarFuncion
};
