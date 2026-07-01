package com.cinepotosi.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record TicketDto(
    Long id,
    String codigoUnico,
    Long usuarioId,
    String cliente,
    Long funcionId,
    Long peliculaId,
    String peliculaTitulo,
    Long salaId,
    String salaNombre,
    Long asientoId,
    String asiento,
    String estado,
    LocalDateTime fechaCompra,
    LocalDate fechaFuncion,
    LocalTime horaInicio,
    BigDecimal total
) {
}
