package com.project.repositories;
import com.project.models.Afiliacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AfiliacionRepository extends JpaRepository<Afiliacion, Long> {
        Afiliacion findByAbonadoIdAndActivaTrue(Long abonadoId);
    }


