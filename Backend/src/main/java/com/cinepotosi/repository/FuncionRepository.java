package com.cinepotosi.repository;

import com.cinepotosi.entity.Funcion;
import com.cinepotosi.entity.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FuncionRepository extends JpaRepository<Funcion, Long> {
    List<Funcion> findByPelicula(Pelicula pelicula);
    List<Funcion> findByEstadoIgnoreCaseOrderByFechaAscHoraInicioAsc(String estado);
    List<Funcion> findByPeliculaAndEstadoIgnoreCaseOrderByFechaAscHoraInicioAsc(Pelicula pelicula, String estado);
}
