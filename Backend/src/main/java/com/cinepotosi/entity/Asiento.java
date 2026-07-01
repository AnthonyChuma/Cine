package com.cinepotosi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "asientos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"sala_id", "fila", "numero"})
})
@Getter
@Setter
@NoArgsConstructor
public class Asiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fila;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private String estado = "DISPONIBLE";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;
}
