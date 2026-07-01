package com.cinepotosi.service;

import com.cinepotosi.dto.PeliculaDto;
import com.cinepotosi.dto.PeliculaPublicDto;
import com.cinepotosi.entity.Genero;
import com.cinepotosi.entity.Pelicula;
import com.cinepotosi.mapper.PeliculaMapper;
import com.cinepotosi.mapper.PeliculaPublicMapper;
import com.cinepotosi.repository.GeneroRepository;
import com.cinepotosi.repository.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PeliculaService {
    private final PeliculaRepository peliculaRepository;
    private final GeneroRepository generoRepository;
    private final PeliculaMapper peliculaMapper;
    private final PeliculaPublicMapper peliculaPublicMapper;

    public List<PeliculaDto> listar() {
        return peliculaRepository.findAll().stream().map(peliculaMapper::toDto).toList();
    }

    public List<PeliculaPublicDto> listarActivas() {
        return peliculaRepository.findByEstadoIgnoreCaseOrderByFechaEstrenoDesc("ACTIVA")
            .stream()
            .map(peliculaPublicMapper::toDto)
            .toList();
    }

    public PeliculaDto obtener(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        return peliculaMapper.toDto(pelicula);
    }

    public PeliculaPublicDto obtenerPublica(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        return peliculaPublicMapper.toDto(pelicula);
    }

    public PeliculaDto crear(PeliculaDto dto) {
        Genero genero = generoRepository.findById(dto.generoId()).orElseThrow(() -> new RuntimeException("Género no encontrado"));
        Pelicula pelicula = peliculaMapper.toEntity(dto, genero);
        return peliculaMapper.toDto(peliculaRepository.save(pelicula));
    }

    public PeliculaDto actualizar(Long id, PeliculaDto dto) {
        Pelicula pelicula = peliculaRepository.findById(id).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        Genero genero = generoRepository.findById(dto.generoId()).orElseThrow(() -> new RuntimeException("Género no encontrado"));
        pelicula.setTitulo(dto.titulo());
        pelicula.setSinopsis(dto.sinopsis());
        pelicula.setDuracionMinutos(dto.duracionMinutos());
        pelicula.setClasificacion(dto.clasificacion());
        pelicula.setImagenUrl(dto.imagenUrl());
        pelicula.setTrailerUrl(dto.trailerUrl());
        pelicula.setEstado(dto.estado() != null ? dto.estado() : pelicula.getEstado());
        pelicula.setFechaEstreno(dto.fechaEstreno());
        pelicula.setGenero(genero);
        return peliculaMapper.toDto(peliculaRepository.save(pelicula));
    }

    public void eliminar(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id).orElseThrow(() -> new RuntimeException("Película no encontrada"));
        pelicula.setEstado("INACTIVA");
        peliculaRepository.save(pelicula);
    }
}
