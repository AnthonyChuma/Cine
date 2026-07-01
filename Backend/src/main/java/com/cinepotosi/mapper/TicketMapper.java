package com.cinepotosi.mapper;

import com.cinepotosi.dto.TicketDto;
import com.cinepotosi.entity.Ticket;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {
    public TicketDto toDto(Ticket ticket) {
        String cliente = ticket.getUsuario().getNombre() + " " + ticket.getUsuario().getApellido();
        String asiento = ticket.getAsiento().getFila() + ticket.getAsiento().getNumero();
        return new TicketDto(
            ticket.getId(),
            ticket.getCodigoUnico(),
            ticket.getUsuario().getId(),
            cliente,
            ticket.getFuncion().getId(),
            ticket.getFuncion().getPelicula().getId(),
            ticket.getFuncion().getPelicula().getTitulo(),
            ticket.getFuncion().getSala().getId(),
            ticket.getFuncion().getSala().getNombre(),
            ticket.getAsiento().getId(),
            asiento,
            ticket.getEstado(),
            ticket.getFechaCompra(),
            ticket.getFuncion().getFecha(),
            ticket.getFuncion().getHoraInicio(),
            ticket.getTotal()
        );
    }
}
