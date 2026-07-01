package com.cinepotosi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "peliculas")
@Getter
@Setter
@NoArgsConstructor
public class Pelicula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 4000)
    private String sinopsis;

    private Integer duracionMinutos;

    private String clasificacion;

    private String imagenUrl;

    private String trailerUrl;

    @Column(nullable = false)
    private String estado = "ACTIVO";

    private LocalDate fechaEstreno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genero_id")
    private Genero genero;
}
