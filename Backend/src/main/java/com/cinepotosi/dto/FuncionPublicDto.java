package com.cinepotosi.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record FuncionPublicDto(
    Long id,
    Long peliculaId,
    String peliculaTitulo,
    Long salaId,
    String salaNombre,
    LocalDate fecha,
    LocalTime horaInicio,
    LocalTime horaFin,
    BigDecimal precio,
    String estado
) {
}
