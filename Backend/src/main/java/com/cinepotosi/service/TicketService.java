package com.cinepotosi.service;

import com.cinepotosi.dto.CompraTicketRequest;
import com.cinepotosi.dto.DashboardStatsDto;
import com.cinepotosi.dto.TicketDto;
import com.cinepotosi.entity.*;
import com.cinepotosi.mapper.TicketMapper;
import com.cinepotosi.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final FuncionRepository funcionRepository;
    private final AsientoRepository asientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final PagoRepository pagoRepository;
    private final PeliculaRepository peliculaRepository;
    private final TicketMapper ticketMapper;

    @Transactional
    public TicketDto comprar(String correo, CompraTicketRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return crearTicket(usuario, null, request);
    }

    @Transactional
    public TicketDto ventaPresencial(String correoCajero, CompraTicketRequest request) {
        Usuario cajero = usuarioRepository.findByCorreo(correoCajero).orElseThrow(() -> new RuntimeException("Cajero no encontrado"));
        return crearTicket(null, cajero, request);
    }

    private TicketDto crearTicket(Usuario cliente, Usuario cajero, CompraTicketRequest request) {
        Funcion funcion = funcionRepository.findById(request.funcionId()).orElseThrow(() -> new RuntimeException("Función no encontrada"));
        Asiento asiento = asientoRepository.findById(request.asientoId()).orElseThrow(() -> new RuntimeException("Asiento no encontrado"));

        if (!asiento.getSala().getId().equals(funcion.getSala().getId())) {
            throw new RuntimeException("El asiento no pertenece a la sala de la función");
        }

        if (ticketRepository.existsByFuncionIdAndAsientoId(funcion.getId(), asiento.getId())) {
            throw new RuntimeException("El asiento ya está vendido para esta función");
        }

        Usuario usuarioTicket = cliente != null ? cliente : cajero;

        Ticket ticket = new Ticket();
        ticket.setCodigoUnico(generarCodigoTicket());
        ticket.setUsuario(usuarioTicket);
        ticket.setFuncion(funcion);
        ticket.setAsiento(asiento);
        ticket.setEstado("VENDIDO");
        ticket.setFechaCompra(LocalDateTime.now());
        ticket.setTotal(funcion.getPrecio());

        Ticket guardado = ticketRepository.save(ticket);

        Venta venta = new Venta();
        venta.setUsuario(cliente);
        venta.setCajero(cajero);
        venta.setFechaVenta(LocalDateTime.now());
        venta.setTotal(funcion.getPrecio());
        venta.setMetodoPago(request.metodoPago() != null ? request.metodoPago() : "EFECTIVO");
        venta.setEstado("COMPLETADA");
        Venta ventaGuardada = ventaRepository.save(venta);

        DetalleVenta detalle = new DetalleVenta();
        detalle.setVenta(ventaGuardada);
        detalle.setTicket(guardado);
        detalle.setPrecioUnitario(funcion.getPrecio());
        detalleVentaRepository.save(detalle);

        Pago pago = new Pago();
        pago.setVenta(ventaGuardada);
        pago.setMetodo(venta.getMetodoPago());
        pago.setMonto(funcion.getPrecio());
        pago.setEstado("PAGADO");
        pago.setFechaPago(LocalDateTime.now());
        pago.setReferencia(UUID.randomUUID().toString());
        pagoRepository.save(pago);

        return ticketMapper.toDto(guardado);
    }

    public List<TicketDto> misTickets(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ticketRepository.findByUsuarioOrderByFechaCompraDesc(usuario).stream().map(ticketMapper::toDto).toList();
    }

    public TicketDto validarTicket(String codigoUnico) {
        Ticket ticket = ticketRepository.findByCodigoUnico(codigoUnico).orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        return ticketMapper.toDto(ticket);
    }

    @Transactional
    public TicketDto anularTicket(String codigoUnico) {
        Ticket ticket = ticketRepository.findByCodigoUnico(codigoUnico).orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        ticket.setEstado("ANULADO");
        return ticketMapper.toDto(ticketRepository.save(ticket));
    }

    public DashboardStatsDto obtenerEstadisticas() {
        BigDecimal recaudacion = ticketRepository.recaudacionTotal();
        return new DashboardStatsDto(
            peliculaRepository.count(),
            funcionRepository.count(),
            ticketRepository.count(),
            recaudacion != null ? recaudacion : BigDecimal.ZERO
        );
    }

    private String generarCodigoTicket() {
        return "CH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
