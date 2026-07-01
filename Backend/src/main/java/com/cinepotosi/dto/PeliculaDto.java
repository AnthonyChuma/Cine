package com.cinepotosi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PeliculaDto(
    Long id,
    @NotBlank String titulo,
    String sinopsis,
    @NotNull Integer duracionMinutos,
    String clasificacion,
    String imagenUrl,
    String trailerUrl,
    String estado,
    LocalDate fechaEstreno,
    Long generoId
) {
}
