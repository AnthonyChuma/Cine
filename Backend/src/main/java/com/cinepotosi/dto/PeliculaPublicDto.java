package com.cinepotosi.dto;

import java.time.LocalDate;

public record PeliculaPublicDto(
    Long id,
    String titulo,
    String sinopsis,
    Integer duracionMinutos,
    String clasificacion,
    String imagenUrl,
    String trailerUrl,
    String estado,
    LocalDate fechaEstreno,
    Long generoId,
    String generoNombre
) {
}
