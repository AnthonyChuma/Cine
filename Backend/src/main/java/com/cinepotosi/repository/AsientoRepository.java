package com.cinepotosi.repository;

import com.cinepotosi.entity.Asiento;
import com.cinepotosi.entity.Sala;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AsientoRepository extends JpaRepository<Asiento, Long> {
    List<Asiento> findBySala(Sala sala);
}
