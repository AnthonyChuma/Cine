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

import java.util.List;

@RestController
@RequestMapping("/api/cliente")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CLIENTE')")
public class ClienteController {
    private final TicketService ticketService;

    @PostMapping("/comprar-ticket")
    public ResponseEntity<TicketDto> comprarTicket(@Valid @RequestBody CompraTicketRequest request, Authentication authentication) {
        return ResponseEntity.ok(ticketService.comprar(authentication.getName(), request));
    }

    @GetMapping("/mis-tickets")
    public ResponseEntity<List<TicketDto>> misTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.misTickets(authentication.getName()));
    }
}
