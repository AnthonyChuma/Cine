package com.cinepotosi.repository;

import com.cinepotosi.entity.Funcion;
import com.cinepotosi.entity.Ticket;
import com.cinepotosi.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByCodigoUnico(String codigoUnico);
    List<Ticket> findByUsuario(Usuario usuario);
    List<Ticket> findByUsuarioOrderByFechaCompraDesc(Usuario usuario);
    List<Ticket> findByFuncionId(Long funcionId);
    boolean existsByFuncionAndAsientoId(Funcion funcion, Long asientoId);
    boolean existsByFuncionIdAndAsientoId(Long funcionId, Long asientoId);

    @Query("select coalesce(sum(t.total), 0) from Ticket t where t.estado <> 'ANULADO'")
    BigDecimal recaudacionTotal();
}
