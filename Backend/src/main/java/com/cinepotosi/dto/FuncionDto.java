package com.cinepotosi.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record FuncionDto(
    Long id,
    @NotNull Long peliculaId,
    @NotNull Long salaId,
    @NotNull LocalDate fecha,
    @NotNull LocalTime horaInicio,
    @NotNull LocalTime horaFin,
    @NotNull BigDecimal precio,
    String estado
) {
}
