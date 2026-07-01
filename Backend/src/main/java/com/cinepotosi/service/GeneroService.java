package com.cinepotosi.service;

import com.cinepotosi.entity.Genero;
import com.cinepotosi.repository.GeneroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeneroService {
    private final GeneroRepository generoRepository;

    public List<Genero> listar() {
        return generoRepository.findAll();
    }

    public Genero crear(Genero genero) {
        return generoRepository.save(genero);
    }

    public Genero obtener(Long id) {
        return generoRepository.findById(id).orElseThrow(() -> new RuntimeException("Género no encontrado"));
    }

    public Genero actualizar(Long id, Genero genero) {
        Genero existente = obtener(id);
        existente.setNombre(genero.getNombre());
        return generoRepository.save(existente);
    }

    public void eliminar(Long id) {
        generoRepository.deleteById(id);
    }
}
