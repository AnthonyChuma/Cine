package com.cinepotosi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @Email(message = "El correo debe ser válido") @NotBlank(message = "El correo es obligatorio") String correo,
    @NotBlank(message = "La contraseña es obligatoria") String password
) {
}
