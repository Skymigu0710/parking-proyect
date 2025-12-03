package com.project.controllers;


import com.project.models.PagoMensual;
import com.project.services.PagoMensualService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.dto.CuotaRequest;
@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    @Autowired
    private PagoMensualService pagoService;

    @PostMapping("/cuotas")
    public ResponseEntity<String> definirCuotas(@RequestBody CuotaRequest request) {
        pagoService.definirCuotas(
                request.getAfiliacionId(),
                request.getMontoMensual(),
                request.getMeses(),
                request.getAñoInicio()
        );
        return ResponseEntity.ok("Cuotas definidas correctamente");
    }

    // Confirmar pago
    @PutMapping("/confirmar/{pagoId}")
    public ResponseEntity<PagoMensual> confirmarPago(@PathVariable Long pagoId) {
        PagoMensual pago = pagoService.confirmarPago(pagoId);
        return ResponseEntity.ok(pago);
    }


}