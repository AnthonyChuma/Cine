package com.cinepotosi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cajero_id")
    private Usuario cajero;

    @Column(nullable = false)
    private LocalDateTime fechaVenta = LocalDateTime.now();

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private String metodoPago;

    @Column(nullable = false)
    private String estado = "COMPLETADA";
}
