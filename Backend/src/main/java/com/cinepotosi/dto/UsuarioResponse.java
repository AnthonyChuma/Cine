package com.cinepotosi.dto;

import java.time.LocalDateTime;

public record UsuarioResponse(Long id, String nombre, String apellido, String correo, String rol, String estado, LocalDateTime fechaCreacion) {
}
