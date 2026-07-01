package com.cinepotosi.service;

import com.cinepotosi.dto.AuthResponse;
import com.cinepotosi.dto.LoginRequest;
import com.cinepotosi.dto.RegisterRequest;
import com.cinepotosi.dto.UsuarioResponse;
import com.cinepotosi.entity.Rol;
import com.cinepotosi.entity.Usuario;
import com.cinepotosi.mapper.UsuarioMapper;
import com.cinepotosi.repository.RolRepository;
import com.cinepotosi.repository.UsuarioRepository;
import com.cinepotosi.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioMapper usuarioMapper;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Rol clienteRol = rolRepository.findByNombre("CLIENTE")
            .orElseThrow(() -> new RuntimeException("Rol CLIENTE no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setApellido(request.apellido());
        usuario.setCorreo(request.correo());
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setEstado("ACTIVO");
        usuario.setRol(clienteRol);

        usuarioRepository.save(usuario);
        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token, "Bearer", usuario.getRol().getNombre(), usuario.getCorreo());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.correo(), request.password())
        );

        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token, "Bearer", usuario.getRol().getNombre(), usuario.getCorreo());
    }

    public UsuarioResponse me(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuarioMapper.toResponse(usuario);
    }
}
