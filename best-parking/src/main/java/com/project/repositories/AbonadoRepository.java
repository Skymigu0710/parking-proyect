package com.project.repositories;


import com.project.dto.AbonadoRequest;
import com.project.models.Abonado;
import com.project.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AbonadoRepository extends JpaRepository<Abonado, Long> {
    Optional<Abonado> findById(Long id);
}
