package com.project.repositories;


import com.project.models.PagoMensual;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoMensualRepository extends JpaRepository<PagoMensual, Long> {
    boolean existsByAfiliacionIdAndMesAndAño(Long afiliacionId, int mes, int año);
}
