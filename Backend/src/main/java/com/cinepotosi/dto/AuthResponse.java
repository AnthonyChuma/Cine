package com.cinepotosi.dto;

public record AuthResponse(String token, String tipo, String rol, String correo) {
}
