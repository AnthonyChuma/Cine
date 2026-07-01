package com.cinepotosi.mapper;

import com.cinepotosi.dto.PeliculaPublicDto;
import com.cinepotosi.entity.Pelicula;
import org.springframework.stereotype.Component;

@Component
public class PeliculaPublicMapper {
    public PeliculaPublicDto toDto(Pelicula pelicula) {
        return new PeliculaPublicDto(
            pelicula.getId(),
            pelicula.getTitulo(),
            pelicula.getSinopsis(),
            pelicula.getDuracionMinutos(),
            pelicula.getClasificacion(),
            pelicula.getImagenUrl(),
            pelicula.getTrailerUrl(),
            pelicula.getEstado(),
            pelicula.getFechaEstreno(),
            pelicula.getGenero() != null ? pelicula.getGenero().getId() : null,
            pelicula.getGenero() != null ? pelicula.getGenero().getNombre() : null
        );
    }
}
