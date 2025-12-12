package com.project.controllers;

import com.project.services.DataTicketsService;
import com.project.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets/ingresos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DataTicketsController {

    private final DataTicketsService ticketService;

    @GetMapping("/diarios")
    public Map<LocalDate, Double> ingresosDiarios(
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin
    ) {
        LocalDate start = LocalDate.parse(fechaInicio);
        LocalDate end = LocalDate.parse(fechaFin);
        return ticketService.getIngresosDiarios(start, end);
    }

    @GetMapping("/semanales")
    public Map<Integer, Double> ingresosSemanales(
            @RequestParam int mes,
            @RequestParam int año
    ) {
        return ticketService.getIngresosSemanales(mes, año);
    }

    @GetMapping("/mensuales")
    public Map<Integer, Double> ingresosMensuales(@RequestParam int año) {
        return ticketService.getIngresosMensuales(año);
    }

    @GetMapping("/anuales")
    public Map<Integer, Double> ingresosAnuales() {
        return ticketService.getIngresosAnuales();
    }
}
