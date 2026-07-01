package com.cinepotosi.repository;

import com.cinepotosi.entity.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    List<Pelicula> findByEstadoIgnoreCaseOrderByFechaEstrenoDesc(String estado);
}
