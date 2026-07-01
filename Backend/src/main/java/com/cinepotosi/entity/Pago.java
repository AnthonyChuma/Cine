package com.cinepotosi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Getter
@Setter
@NoArgsConstructor
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    @Column(nullable = false)
    private String metodo;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(nullable = false)
    private String estado = "PAGADO";

    @Column(nullable = false)
    private LocalDateTime fechaPago = LocalDateTime.now();

    private String referencia;
}
