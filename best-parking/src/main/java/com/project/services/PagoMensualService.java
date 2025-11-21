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
    private PagoMensualRepository pagoMensualRepository;
    private AfiliacionRepository afiliacionRepository;
    public PagoMensual registrarPago(Long afiliacionId, int mes, int año, double monto) {

        // Evitar duplicados
        if (pagoMensualRepository.existsByAfiliacionIdAndMesAndAño(afiliacionId, mes, año)) {
            throw new RuntimeException("El mes ya fue pagado");
        }
        Afiliacion afiliacion = afiliacionRepository.findById(afiliacionId)
                .orElseThrow(() -> new RuntimeException("Afiliación no encontrada"));

        PagoMensual pago = new PagoMensual();
        pago.setAfiliacion(afiliacion);
        pago.setMes(mes);
        pago.setAño(año);
        pago.setMonto(monto);

        return pagoMensualRepository.save(pago);
    }
}
