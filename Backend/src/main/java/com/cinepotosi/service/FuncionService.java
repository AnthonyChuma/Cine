package com.cinepotosi.service;

import com.cinepotosi.dto.FuncionDto;
import com.cinepotosi.dto.FuncionPublicDto;
import com.cinepotosi.entity.Funcion;
import com.cinepotosi.entity.Pelicula;
import com.cinepotosi.entity.Sala;
import com.cinepotosi.mapper.FuncionMapper;
import com.cinepotosi.mapper.FuncionPublicMapper;
import com.cinepotosi.repository.FuncionRepository;
import com.cinepotosi.repository.PeliculaRepository;
import com.cinepotosi.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuncionService {
    private final FuncionRepository funcionRepository;
    private final PeliculaRepository peliculaRepository;
    private final SalaRepository salaRepository;
    private final FuncionMapper funcionMapper;
    private final FuncionPublicMapper funcionPublicMapper;

    public List<FuncionDto> listar() {
        return funcionRepository.findAll().stream().map(funcionMapper::toDto).toList();
    }

    public List<FuncionPublicDto> listarPublicas() {
        return funcionRepository.findByEstadoIgnoreCaseOrderByFechaAscHoraInicioAsc("PROGRAMADA")
            .stream()
            .map(funcionPublicMapper::toDto)
            .toList();
    }

    public List<FuncionDto> listarPorPelicula(Long peliculaId) {
        Pelicula pelicula = peliculaRepository.findById(peliculaId).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        return funcionRepository.findByPelicula(pelicula).stream().map(funcionMapper::toDto).toList();
    }

    public List<FuncionPublicDto> listarPublicasPorPelicula(Long peliculaId) {
        Pelicula pelicula = peliculaRepository.findById(peliculaId).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        return funcionRepository.findByPeliculaAndEstadoIgnoreCaseOrderByFechaAscHoraInicioAsc(pelicula, "PROGRAMADA")
            .stream()
            .map(funcionPublicMapper::toDto)
            .toList();
    }

    public FuncionDto crear(FuncionDto dto) {
        Pelicula pelicula = peliculaRepository.findById(dto.peliculaId()).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        Sala sala = salaRepository.findById(dto.salaId()).orElseThrow(() -> new RuntimeException("Sala no encontrada"));
        Funcion funcion = funcionMapper.toEntity(dto, pelicula, sala);
        return funcionMapper.toDto(funcionRepository.save(funcion));
    }

    public FuncionDto actualizar(Long id, FuncionDto dto) {
        Funcion funcion = funcionRepository.findById(id).orElseThrow(() -> new RuntimeException("Función no encontrada"));
        Pelicula pelicula = peliculaRepository.findById(dto.peliculaId()).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        Sala sala = salaRepository.findById(dto.salaId()).orElseThrow(() -> new RuntimeException("Sala no encontrada"));
        funcion.setPelicula(pelicula);
        funcion.setSala(sala);
        funcion.setFecha(dto.fecha());
        funcion.setHoraInicio(dto.horaInicio());
        funcion.setHoraFin(dto.horaFin());
        funcion.setPrecio(dto.precio());
        funcion.setEstado(dto.estado() != null ? dto.estado() : funcion.getEstado());
        return funcionMapper.toDto(funcionRepository.save(funcion));
    }

    public void eliminar(Long id) {
        Funcion funcion = funcionRepository.findById(id).orElseThrow(() -> new RuntimeException("Función no encontrada"));
        funcion.setEstado("CANCELADA");
        funcionRepository.save(funcion);
    }
}
