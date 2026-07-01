package com.cinepotosi.controller;

import com.cinepotosi.dto.FuncionDto;
import com.cinepotosi.dto.DashboardStatsDto;
import com.cinepotosi.dto.PeliculaDto;
import com.cinepotosi.entity.Genero;
import com.cinepotosi.entity.Sala;
import com.cinepotosi.service.AsientoService;
import com.cinepotosi.service.FuncionService;
import com.cinepotosi.service.GeneroService;
import com.cinepotosi.service.PeliculaService;
import com.cinepotosi.service.SalaService;
import com.cinepotosi.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final PeliculaService peliculaService;
    private final GeneroService generoService;
    private final SalaService salaService;
    private final AsientoService asientoService;
    private final FuncionService funcionService;
    private final TicketService ticketService;

    @GetMapping("/peliculas")
    public ResponseEntity<List<PeliculaDto>> listarPeliculas() { return ResponseEntity.ok(peliculaService.listar()); }

    @PostMapping("/peliculas")
    public ResponseEntity<PeliculaDto> crearPelicula(@Valid @RequestBody PeliculaDto dto) { return ResponseEntity.ok(peliculaService.crear(dto)); }

    @PutMapping("/peliculas/{id}")
    public ResponseEntity<PeliculaDto> actualizarPelicula(@PathVariable Long id, @Valid @RequestBody PeliculaDto dto) { return ResponseEntity.ok(peliculaService.actualizar(id, dto)); }

    @DeleteMapping("/peliculas/{id}")
    public ResponseEntity<Void> eliminarPelicula(@PathVariable Long id) { peliculaService.eliminar(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/generos")
    public ResponseEntity<List<Genero>> listarGeneros() { return ResponseEntity.ok(generoService.listar()); }

    @PostMapping("/generos")
    public ResponseEntity<Genero> crearGenero(@RequestBody Genero genero) { return ResponseEntity.ok(generoService.crear(genero)); }

    @GetMapping("/salas")
    public ResponseEntity<List<Sala>> listarSalas() { return ResponseEntity.ok(salaService.listar()); }

    @PostMapping("/salas")
    public ResponseEntity<Sala> crearSala(@RequestBody Sala sala) { return ResponseEntity.ok(salaService.crear(sala)); }

    @PostMapping("/salas/{id}/asientos")
    public ResponseEntity<?> crearAsiento(@PathVariable Long id, @RequestBody com.cinepotosi.entity.Asiento asiento) { return ResponseEntity.ok(asientoService.crear(id, asiento)); }

    @GetMapping("/salas/{id}/asientos")
    public ResponseEntity<?> listarAsientos(@PathVariable Long id) { return ResponseEntity.ok(asientoService.listarPorSala(id)); }

    @GetMapping("/funciones")
    public ResponseEntity<List<FuncionDto>> listarFunciones() { return ResponseEntity.ok(funcionService.listar()); }

    @PostMapping("/funciones")
    public ResponseEntity<FuncionDto> crearFuncion(@Valid @RequestBody FuncionDto dto) { return ResponseEntity.ok(funcionService.crear(dto)); }

    @PutMapping("/funciones/{id}")
    public ResponseEntity<FuncionDto> actualizarFuncion(@PathVariable Long id, @Valid @RequestBody FuncionDto dto) { return ResponseEntity.ok(funcionService.actualizar(id, dto)); }

    @DeleteMapping("/funciones/{id}")
    public ResponseEntity<Void> eliminarFuncion(@PathVariable Long id) { funcionService.eliminar(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/reportes/dashboard")
    public ResponseEntity<DashboardStatsDto> dashboard() { return ResponseEntity.ok(ticketService.obtenerEstadisticas()); }
}
