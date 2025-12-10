package com.project.services;

import com.project.dto.AfiliacionRequest;
import com.project.dto.AfiliacionResponse;
import com.project.models.Abonado;
import com.project.models.Afiliacion;
import com.project.models.PagoMensual;
import com.project.repositories.AbonadoRepository;
import com.project.repositories.AfiliacionRepository;
import com.project.repositories.PagoMensualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AfiliacionService {

    private final AbonadoRepository abonado_r;
    private final AfiliacionRepository afiliacionRepository;
    private final PagoMensualService pagoMensualService;

    public AfiliacionResponse afiliar(AfiliacionRequest request) {
        Abonado abonado = abonado_r.findById(request.getAbonadoId())
                .orElseThrow(() -> new RuntimeException("Abonado no encontrado"));
        int meses= calcularMeses(request.getFechaInicio(), request.getFechaFin());
        Afiliacion nueva = new Afiliacion();
        nueva.setAbonado(abonado);
        nueva.setFechaInicio(request.getFechaInicio() != null ? request.getFechaInicio() : LocalDate.now());
        nueva.setFechaFin(request.getFechaFin()); // puede ser null si no se quiere establecer aún
        nueva.setMes(meses);
        nueva.setMonto(request.getMonto());
        nueva.setActiva(true);

        Afiliacion guardada = afiliacionRepository.save(nueva);
        pagoMensualService.definirCuotas(
                guardada.getId(),
                guardada.getMonto()
        );

        return AfiliacionResponse.builder()
                .id(guardada.getId())
                .fechaInicio(guardada.getFechaInicio().toString())
                .fechaFin(guardada.getFechaFin() != null ? guardada.getFechaFin().toString() : null)
                .activa(guardada.isActiva())
                .mes(guardada.getMes())
                .monto(guardada.getMonto())
                .build();
    }
    public AfiliacionResponse desafiliar(Long abonadoId, LocalDate fechaFin) {
        Afiliacion activa = afiliacionRepository.findByAbonadoIdAndActivaTrue(abonadoId);

        if (activa == null) {
            throw new RuntimeException("No hay afiliación activa para este abonado");
        }

        activa.setActiva(false);
        activa.setFechaFin(fechaFin != null ? fechaFin : LocalDate.now());
        Afiliacion guardada = afiliacionRepository.save(activa);

        return AfiliacionResponse.builder()
                .id(guardada.getId())
                .fechaInicio(guardada.getFechaInicio().toString())
                .fechaFin(guardada.getFechaFin().toString())
                .activa(guardada.isActiva())
                .build();
    }
    private int calcularMeses(LocalDate inicio, LocalDate fin) {
        if (fin == null) return 1; // o lo que tú decidas si no tiene fin

        return (int) ChronoUnit.MONTHS.between(inicio, fin) + 1;
    }

}
