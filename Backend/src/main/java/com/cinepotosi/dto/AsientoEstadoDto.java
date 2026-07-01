package com.cinepotosi.dto;

public record AsientoEstadoDto(
    Long id,
    String fila,
    Integer numero,
    String estado,
    boolean ocupado,
    boolean disponible
) {
}
