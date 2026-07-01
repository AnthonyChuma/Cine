package com.cinepotosi.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/login",
            "/registro",
            "/cartelera",
            "/mis-tickets",
            "/checkout",
            "/perfil",
            "/admin",
            "/admin/peliculas",
            "/admin/generos",
            "/admin/salas",
            "/admin/asientos",
            "/admin/funciones",
            "/admin/usuarios",
            "/admin/reportes",
            "/caja",
            "/caja/venta",
            "/caja/validar-ticket",
            "/caja/ventas-dia",
            "/pelicula/{id}",
            "/seleccionar-funcion/{id}",
            "/seleccionar-asientos/{id}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
