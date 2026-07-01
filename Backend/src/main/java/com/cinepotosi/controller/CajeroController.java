package com.cinepotosi.controller;

import com.cinepotosi.dto.CompraTicketRequest;
import com.cinepotosi.dto.TicketDto;
import com.cinepotosi.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cajero")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CAJERO','ADMIN')")
public class CajeroController {

    private final TicketService ticketService;

    @PostMapping("/venta-presencial")
    public ResponseEntity<TicketDto> ventaPresencial(@Valid @RequestBody CompraTicketRequest request, Authentication authentication) {
        return ResponseEntity.ok(ticketService.ventaPresencial(authentication.getName(), request));
    }

    @GetMapping("/validar-ticket/{codigo}")
    public ResponseEntity<TicketDto> validarTicket(@PathVariable String codigo) {
        return ResponseEntity.ok(ticketService.validarTicket(codigo));
    }

    @PostMapping("/validar-ticket")
    public ResponseEntity<TicketDto> validarTicketPost(@RequestParam String codigo) {
        return ResponseEntity.ok(ticketService.validarTicket(codigo));
    }

    @PostMapping("/anular-ticket/{codigo}")
    public ResponseEntity<TicketDto> anularTicket(@PathVariable String codigo) {
        return ResponseEntity.ok(ticketService.anularTicket(codigo));
    }

    @GetMapping("/ventas-dia")
    public ResponseEntity<String> ventasDia() {
        return ResponseEntity.ok("Consulte reportes desde /api/admin/reportes/dashboard");
    }
}
