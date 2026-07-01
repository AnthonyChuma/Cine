package com.cinepotosi.service;

import com.cinepotosi.entity.Sala;
import com.cinepotosi.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaService {
    private final SalaRepository salaRepository;

    public List<Sala> listar() {
        return salaRepository.findAll();
    }

    public Sala crear(Sala sala) {
        return salaRepository.save(sala);
    }

    public Sala obtener(Long id) {
        return salaRepository.findById(id).orElseThrow(() -> new RuntimeException("Sala no encontrada"));
    }

    public Sala actualizar(Long id, Sala sala) {
        Sala existente = obtener(id);
        existente.setNombre(sala.getNombre());
        existente.setCapacidad(sala.getCapacidad());
        existente.setEstado(sala.getEstado());
        return salaRepository.save(existente);
    }

    public void eliminar(Long id) {
        salaRepository.deleteById(id);
    }
}
