package com.project.controllers;

import com.project.dto.TicketResponse;
import com.project.dto.VehicleEntryRequest;
import com.project.models.Ticket;
import com.project.services.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/entry")
    public TicketResponse registerEntry(@RequestBody VehicleEntryRequest request, Authentication authentication) {
        return ticketService.registerEntry(request, authentication);
    }

    @PutMapping("/exit/{id}")
    public TicketResponse registerExit(@PathVariable Long id) {
        return ticketService.registerExit(id);
    }

   /* @PostMapping("/special")
    public TicketResponse registerSpecialTicket(@RequestBody VehicleEntryRequest request,
                                                @RequestParam double manualAmount) {
        return ticketService.registerSpecialTicket(request, manualAmount);
    }*/

    @GetMapping("/getTicket")
    public List<TicketResponse> getAllTickets() {
        return ticketService.listAllTickets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById (@PathVariable Long id){
        Ticket ticket = ticketService.getTicketById(id);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }

        TicketResponse response = TicketResponse.builder()
                .id(ticket.getId())
                .licensePlate(ticket.getVehicle().getLicensePlate())
                .type(ticket.getVehicle().getType().name())
                .entryTime(ticket.getEntryTime())
                .exitTime(ticket.getExitTime())
                .totalAmount(ticket.getTotalAmount())
                .status(ticket.getStatus().name())
                .detalle(ticket.getDetalle())
                .createdBy(ticket.getCreatedBy().getName())
                .build();

        return ResponseEntity.ok(response);
    }
}