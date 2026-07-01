package com.cinepotosi.service;

import com.cinepotosi.dto.AsientoEstadoDto;
import com.cinepotosi.entity.Asiento;
import com.cinepotosi.entity.Funcion;
import com.cinepotosi.entity.Sala;
import com.cinepotosi.entity.Ticket;
import com.cinepotosi.repository.AsientoRepository;
import com.cinepotosi.repository.FuncionRepository;
import com.cinepotosi.repository.SalaRepository;
import com.cinepotosi.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsientoService {
    private final AsientoRepository asientoRepository;
    private final SalaRepository salaRepository;
    private final FuncionRepository funcionRepository;
    private final TicketRepository ticketRepository;

    public List<Asiento> listarPorSala(Long salaId) {
        Sala sala = salaRepository.findById(salaId).orElseThrow(() -> new RuntimeException("Sala no encontrada"));
        return asientoRepository.findBySala(sala);
    }

    public List<AsientoEstadoDto> listarPorFuncion(Long funcionId) {
        Funcion funcion = funcionRepository.findById(funcionId).orElseThrow(() -> new RuntimeException("Función no encontrada"));
        Set<Long> ocupados = ticketRepository.findByFuncionId(funcionId)
            .stream()
            .filter(ticket -> !"ANULADO".equalsIgnoreCase(ticket.getEstado()))
            .map(ticket -> ticket.getAsiento().getId())
            .collect(Collectors.toSet());

        return asientoRepository.findBySala(funcion.getSala())
            .stream()
            .map(asiento -> {
                boolean ocupado = ocupados.contains(asiento.getId()) || "BLOQUEADO".equalsIgnoreCase(asiento.getEstado());
                return new AsientoEstadoDto(
                    asiento.getId(),
                    asiento.getFila(),
                    asiento.getNumero(),
                    asiento.getEstado(),
                    ocupado,
                    !ocupado && "DISPONIBLE".equalsIgnoreCase(asiento.getEstado())
                );
            })
            .toList();
    }

    public Asiento crear(Long salaId, Asiento asiento) {
        Sala sala = salaRepository.findById(salaId).orElseThrow(() -> new RuntimeException("Sala no encontrada"));
        asiento.setSala(sala);
        return asientoRepository.save(asiento);
    }
}
