package com.cinepotosi.mapper;

import com.cinepotosi.dto.UsuarioResponse;
import com.cinepotosi.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {
    public UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getCorreo(),
            usuario.getRol().getNombre(),
            usuario.getEstado(),
            usuario.getFechaCreacion()
        );
    }
}
