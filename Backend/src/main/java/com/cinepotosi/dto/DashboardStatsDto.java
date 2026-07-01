package com.cinepotosi.dto;

import java.math.BigDecimal;

public record DashboardStatsDto(
    long peliculas,
    long funciones,
    long ticketsVendidos,
    BigDecimal recaudacionTotal
) {
}
