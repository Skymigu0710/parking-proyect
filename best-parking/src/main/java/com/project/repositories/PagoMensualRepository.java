package com.project.repositories;


import com.project.models.PagoMensual;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface PagoMensualRepository extends JpaRepository<PagoMensual, Long> {
    boolean existsByAfiliacionIdAndMesAndAño(Long afiliacionId, int mes, int año);
    Optional<PagoMensual> findById(Long afiliacionId);
    boolean existsByAfiliacionIdAndMes(Long afiliacionId, int mes);
}
