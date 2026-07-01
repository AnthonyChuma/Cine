package com.cinepotosi.mapper;

import com.cinepotosi.dto.PeliculaDto;
import com.cinepotosi.entity.Genero;
import com.cinepotosi.entity.Pelicula;
import org.springframework.stereotype.Component;

@Component
public class PeliculaMapper {
    public PeliculaDto toDto(Pelicula pelicula) {
        return new PeliculaDto(
            pelicula.getId(),
            pelicula.getTitulo(),
            pelicula.getSinopsis(),
            pelicula.getDuracionMinutos(),
            pelicula.getClasificacion(),
            pelicula.getImagenUrl(),
            pelicula.getTrailerUrl(),
            pelicula.getEstado(),
            pelicula.getFechaEstreno(),
            pelicula.getGenero() != null ? pelicula.getGenero().getId() : null
        );
    }

    public Pelicula toEntity(PeliculaDto dto, Genero genero) {
        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(dto.titulo());
        pelicula.setSinopsis(dto.sinopsis());
        pelicula.setDuracionMinutos(dto.duracionMinutos());
        pelicula.setClasificacion(dto.clasificacion());
        pelicula.setImagenUrl(dto.imagenUrl());
        pelicula.setTrailerUrl(dto.trailerUrl());
        pelicula.setEstado(dto.estado() != null ? dto.estado() : "ACTIVA");
        pelicula.setFechaEstreno(dto.fechaEstreno());
        pelicula.setGenero(genero);
        return pelicula;
    }
}
