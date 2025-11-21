package com.project.controllers;


import com.project.models.PagoMensual;
import com.project.services.PagoMensualService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    @Autowired
    private PagoMensualService pagoService;

    @PostMapping("/{afiliacionId}")
    public PagoMensual registrar(
            @PathVariable Long afiliacionId,
            @RequestParam int mes,
            @RequestParam int año,
            @RequestParam double monto) {

        return pagoService.registrarPago(afiliacionId, mes, año, monto);
    }
}