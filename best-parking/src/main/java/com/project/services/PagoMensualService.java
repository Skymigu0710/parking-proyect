package com.project.services;


import com.project.models.Afiliacion;
import com.project.models.PagoMensual;
import com.project.repositories.AfiliacionRepository;
import com.project.repositories.PagoMensualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PagoMensualService {
    private final PagoMensualRepository pagoMensualRepository;
    private final AfiliacionRepository afiliacionRepository;

    //definir cuotas para una afiliación
    public void definirCuotas(Long afiliacionId, double montoMensual) {
        Afiliacion afiliacion = afiliacionRepository.findById(afiliacionId)
                .orElseThrow(() -> new RuntimeException("Afiliación no encontrada"));

        LocalDate inicio = afiliacion.getFechaInicio();
        LocalDate fin = afiliacion.getFechaFin();
        LocalDate fechaActual = inicio;
        int contadorCuotas = 1;
        while (!fechaActual.isAfter(fin)) {

            LocalDate fechaSiguiente = fechaActual.plusMonths(1);

            // Ajustar si el último mes excede la fechaFin
            if (fechaSiguiente.isAfter(fin)) {
                fechaSiguiente = fin;
            }

            // Evitar duplicados por número de cuota
            if (!pagoMensualRepository.existsByAfiliacionIdAndMes(afiliacionId, contadorCuotas)) {
                PagoMensual pago = new PagoMensual();
                pago.setAfiliacion(afiliacion);
                pago.setMes(contadorCuotas);
                pago.setFechaInicio(fechaActual);
                pago.setFechaFin(fechaSiguiente);
                pago.setMonto(montoMensual);

                pagoMensualRepository.save(pago);
            }

            fechaActual = fechaSiguiente;  // <── ESTA ES LA CORRECCIÓN CLAVE
            contadorCuotas++;
        }
    }

    public PagoMensual confirmarPago(Long pagoId) {
        PagoMensual pago = pagoMensualRepository.findById(pagoId)
                .orElseThrow(() -> new RuntimeException("Pago no definido para este mes"));

        if (pago.isPagado()) {
            throw new RuntimeException("El mes ya fue pagado");
        }

        pago.setPagado(true); // marca el pago como realizado
        return pagoMensualRepository.save(pago);
    }
}
