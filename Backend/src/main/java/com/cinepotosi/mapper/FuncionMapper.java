package com.cinepotosi.mapper;

import com.cinepotosi.dto.FuncionDto;
import com.cinepotosi.entity.Funcion;
import com.cinepotosi.entity.Pelicula;
import com.cinepotosi.entity.Sala;
import org.springframework.stereotype.Component;

@Component
public class FuncionMapper {
    public FuncionDto toDto(Funcion funcion) {
        return new FuncionDto(
            funcion.getId(),
            funcion.getPelicula().getId(),
            funcion.getSala().getId(),
            funcion.getFecha(),
            funcion.getHoraInicio(),
            funcion.getHoraFin(),
            funcion.getPrecio(),
            funcion.getEstado()
        );
    }

    public Funcion toEntity(FuncionDto dto, Pelicula pelicula, Sala sala) {
        Funcion funcion = new Funcion();
        funcion.setPelicula(pelicula);
        funcion.setSala(sala);
        funcion.setFecha(dto.fecha());
        funcion.setHoraInicio(dto.horaInicio());
        funcion.setHoraFin(dto.horaFin());
        funcion.setPrecio(dto.precio());
        funcion.setEstado(dto.estado() != null ? dto.estado() : "PROGRAMADA");
        return funcion;
    }
}
