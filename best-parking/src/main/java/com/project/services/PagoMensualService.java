package com.project.services;


import com.project.models.Afiliacion;
import com.project.models.PagoMensual;
import com.project.repositories.AfiliacionRepository;
import com.project.repositories.PagoMensualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagoMensualService {
    private final PagoMensualRepository pagoMensualRepository;
    private final AfiliacionRepository afiliacionRepository;

    //definir cuotas para una afiliación
    public void definirCuotas(Long afiliacionId, double montoMensual, int meses, int añoInicio) {
        Afiliacion afiliacion = afiliacionRepository.findById(afiliacionId)
                .orElseThrow(() -> new RuntimeException("Afiliación no encontrada"));

        for (int i = 1; i <= meses; i++) {
            int mes = i;
            // Evitar duplicados
            if (!pagoMensualRepository.existsByAfiliacionIdAndMesAndAño(afiliacionId, mes, añoInicio)) {
                PagoMensual pago = new PagoMensual();
                pago.setAfiliacion(afiliacion);
                pago.setMes(mes);
                pago.setAño(añoInicio);
                pago.setMonto(montoMensual);
                pagoMensualRepository.save(pago);
            }
        }
    }

    public PagoMensual confirmarPago(Long afiliacionId, int mes, int año) {
        PagoMensual pago = pagoMensualRepository.findByAfiliacionIdAndMesAndAño(afiliacionId, mes, año)
                .orElseThrow(() -> new RuntimeException("Pago no definido para este mes"));

        if (pago.isPagado()) {
            throw new RuntimeException("El mes ya fue pagado");
        }

        pago.setPagado(true); // marca el pago como realizado
        return pagoMensualRepository.save(pago);
    }
}
