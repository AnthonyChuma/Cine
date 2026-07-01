package com.cinepotosi.controller;

import com.cinepotosi.dto.AsientoEstadoDto;
import com.cinepotosi.dto.FuncionPublicDto;
import com.cinepotosi.dto.PeliculaPublicDto;
import com.cinepotosi.service.AsientoService;
import com.cinepotosi.service.FuncionService;
import com.cinepotosi.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final PeliculaService peliculaService;
    private final FuncionService funcionService;
    private final AsientoService asientoService;

    @GetMapping("/peliculas")
    public ResponseEntity<List<PeliculaPublicDto>> peliculas() {
        return ResponseEntity.ok(peliculaService.listarActivas());
    }

    @GetMapping("/peliculas/{id}")
    public ResponseEntity<PeliculaPublicDto> peliculaDetalle(@PathVariable Long id) {
        return ResponseEntity.ok(peliculaService.obtenerPublica(id));
    }

    @GetMapping("/funciones")
    public ResponseEntity<List<FuncionPublicDto>> funciones() {
        return ResponseEntity.ok(funcionService.listarPublicas());
    }

    @GetMapping("/peliculas/{id}/funciones")
    public ResponseEntity<List<FuncionPublicDto>> funcionesPorPelicula(@PathVariable Long id) {
        return ResponseEntity.ok(funcionService.listarPublicasPorPelicula(id));
    }

    @GetMapping("/funciones/{id}/asientos")
    public ResponseEntity<List<AsientoEstadoDto>> asientosPorFuncion(@PathVariable Long id) {
        return ResponseEntity.ok(asientoService.listarPorFuncion(id));
    }
}
