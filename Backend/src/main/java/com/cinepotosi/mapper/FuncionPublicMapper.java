package com.cinepotosi.mapper;

import com.cinepotosi.dto.FuncionPublicDto;
import com.cinepotosi.entity.Funcion;
import org.springframework.stereotype.Component;

@Component
public class FuncionPublicMapper {
    public FuncionPublicDto toDto(Funcion funcion) {
        return new FuncionPublicDto(
            funcion.getId(),
            funcion.getPelicula().getId(),
            funcion.getPelicula().getTitulo(),
            funcion.getSala().getId(),
            funcion.getSala().getNombre(),
            funcion.getFecha(),
            funcion.getHoraInicio(),
            funcion.getHoraFin(),
            funcion.getPrecio(),
            funcion.getEstado()
        );
    }
}
