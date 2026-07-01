package com.cinepotosi.dto;

import jakarta.validation.constraints.NotNull;

public record CompraTicketRequest(
    @NotNull Long funcionId,
    @NotNull Long asientoId,
    String metodoPago
) {
}
