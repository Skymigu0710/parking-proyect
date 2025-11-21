package com.project.controllers;

import com.project.dto.AbonadoRequest;
import com.project.dto.AfiliacionRequest;
import com.project.dto.AfiliacionResponse;
import com.project.dto.TicketResponse;
import com.project.models.Abonado;
import com.project.models.Afiliacion;
import com.project.models.Ticket;
import com.project.services.AbonadoService;
import com.project.services.AfiliacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/abonado")
@RequiredArgsConstructor
public class AbonadoController {


    private final AbonadoService abonadoService;
    private final AfiliacionService afiliacionService;

    @PostMapping("/register")
    public ResponseEntity<Abonado> create(@RequestBody AbonadoRequest abonado) {
        Abonado abonadoo= abonadoService.createAbonado(abonado);

        return ResponseEntity.ok(abonadoo);
    }

    @PostMapping("/afiliar")
    public AfiliacionResponse StartAfiliacion(@RequestBody AfiliacionRequest request) {
        return afiliacionService.afiliar(request);
    }
    @PostMapping("/desafiliar/{abonadoId}")
    public AfiliacionResponse desafiliar(
            @PathVariable Long abonadoId,
            @RequestParam(required = false) String fechaFin // "yyyy-MM-dd"
    ) {
        LocalDate fin = fechaFin != null ? LocalDate.parse(fechaFin) : LocalDate.now();
        return afiliacionService.desafiliar(abonadoId, fin);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AbonadoRequest> getAbonadobyId (@PathVariable Long id){
        Abonado abonado = abonadoService.getAbonadoById(id);
        if (abonado == null) {
            return ResponseEntity.notFound().build();
        }
        AbonadoRequest abonadoResponse= AbonadoRequest.builder()
                .id(abonado.getId())
                .nombre(abonado.getNombre())
                .build();
        return ResponseEntity.ok(abonadoResponse);
    }
    @GetMapping("/getAbonados")
    public List<AbonadoRequest> getAllAbonados() {
        return abonadoService.getAllAbonados();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAbonado(@PathVariable Long id) {
        try {
            abonadoService.deleteAbonado(id);
            return ResponseEntity.ok("Abonado eliminado correctamente con id: " + id);

        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }
    }
}