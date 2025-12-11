package com.project.services;

import com.project.dto.TicketResponse;
import com.project.dto.VehicleEntryRequest;
import com.project.models.Ticket;
import com.project.models.TicketStatus;
import com.project.models.Vehicle;
import com.project.models.User;
import com.project.models.VehicleType;
import com.project.repositories.TicketRepository;
import com.project.repositories.VehicleRepository;
import com.project.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketService {

    private final VehicleRepository vehicleRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final QrService qrService;
    public TicketService(VehicleRepository vehicleRepository, TicketRepository ticketRepository, UserRepository userRepository, QrService qrService) {
        this.vehicleRepository = vehicleRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.qrService = qrService;
    }

    public TicketResponse registerEntry(VehicleEntryRequest request, Authentication authentication) {
        String username = authentication.getName();

        Vehicle vehicle = vehicleRepository.findByLicensePlate(request.getLicensePlate().toUpperCase())
                .orElseGet(() -> vehicleRepository.save(
                        Vehicle.builder()
                                .licensePlate(request.getLicensePlate().toUpperCase())
                                .color(request.getColor())
                                .type(VehicleType.valueOf(request.getType().toUpperCase()))
                                .spaceCount(request.getSpaceCount())
                                .build()
                ));

        // Check if there’s already an active ticket
        ticketRepository.findByVehicleAndStatus(vehicle, TicketStatus.ACTIVE)
                .ifPresent(t -> { throw new RuntimeException("Vehicle already has an active ticket."); });

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime entrada= LocalDateTime.now();

        LocalDateTime exit=null;
        Double monto = null;
        TicketStatus estado = TicketStatus.ACTIVE;

        // Si es pago adelantado → calcular monto
        if (request.isPagoAdelantado()) {
            if (request.getHoras() == 0) {
                throw new RuntimeException("Debe ingresar horas si es pago adelantado");
            }
            exit = calcularHoraSalida(entrada, request.getHoras());
            monto = calculateFee(vehicle, entrada, exit) - request.getDiscountAmount();
            if (monto < 0) monto = 0.0;

            estado=TicketStatus.CLOSED;

        }

        Ticket ticket = Ticket.builder()
                .vehicle(vehicle)
                .entryTime(LocalDateTime.now())
                .exitTime(exit)
                .status(estado)
                .discountAmount(request.getDiscountAmount())
                .detalle(request.getDetalle())
                .horas(request.getHoras())
                .pagoAdelantado(request.isPagoAdelantado())
                .totalAmount(monto)
                .createdBy(user)
                .build();

        ticketRepository.save(ticket);

        //QR
        String qrUrl = "http://localhost:5173/ticket/" + ticket.getId();
        // ✔ Generar QR
        byte[] qrBytes = qrService.generateQr(qrUrl);
        // ✔ Convertir a Base64 para que el frontend lo muestre
        String qrBase64 = Base64.getEncoder().encodeToString(qrBytes);

        return TicketResponse.builder()
                .id(ticket.getId())
                .licensePlate(vehicle.getLicensePlate())
                .type(vehicle.getType().name())
                .entryTime(ticket.getEntryTime())
                .exitTime(ticket.getExitTime())
                .status(ticket.getStatus().name())
                .qrBase64(qrBase64)
                .detalle(ticket.getDetalle())
                .horas(ticket.getHoras())
                .totalAmount(ticket.getTotalAmount())
                .createdBy(user.getUsername())
                .build();
    }

    public TicketResponse registerExit(Long id) {
        Ticket ticket = ticketRepository.findByIdAndStatus(id, TicketStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active ticket found for this vehicle."));

        ticket.setExitTime(LocalDateTime.now());

        double amount = calculateFee(ticket.getVehicle(), ticket.getEntryTime(), ticket.getExitTime());
        if (ticket.getDiscountAmount() != null && ticket.getDiscountAmount() > 0) {
            amount -= ticket.getDiscountAmount();
        }
        int horas= horas(ticket.getEntryTime(), ticket.getExitTime());
        ticket.setTotalAmount(Math.max(amount, 0)); // avoid negatives
        ticket.setStatus(TicketStatus.CLOSED);
        ticket.setHoras(horas);
        ticketRepository.save(ticket);

        return TicketResponse.builder()
                .id(ticket.getId())
                .licensePlate(ticket.getVehicle().getLicensePlate())
                .type(ticket.getVehicle().getType().name())
                .entryTime(ticket.getEntryTime())
                .exitTime(ticket.getExitTime())
                .totalAmount(ticket.getTotalAmount())
                .status(ticket.getStatus().name())
                .detalle(ticket.getDetalle())
                .horas(ticket.getHoras())
                .createdBy(ticket.getCreatedBy().getName())
                .build();
    }
    public TicketResponse registerSpecialTicket(VehicleEntryRequest request, double manualAmount, Authentication authentication) {
        String username = authentication.getName();

        Vehicle vehicle = vehicleRepository.findByLicensePlate(request.getLicensePlate().toUpperCase())
                .orElseGet(() -> vehicleRepository.save(
                        Vehicle.builder()
                                .licensePlate(request.getLicensePlate().toUpperCase())
                                .color(request.getColor())
                                .type(VehicleType.valueOf(request.getType().toUpperCase()))
                                .spaceCount(request.getSpaceCount())
                                .build()
                ));

        ticketRepository.findByVehicleAndStatus(vehicle, TicketStatus.ACTIVE)
                .ifPresent(t -> { throw new RuntimeException("Vehicle already tiene un ticket activo."); });

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = Ticket.builder()
                .vehicle(vehicle)
                .entryTime(LocalDateTime.now())
                .exitTime(LocalDateTime.now())
                .status(TicketStatus.CLOSED) // automático
                .totalAmount(manualAmount)
                .manualAmount(manualAmount)
                .specialTicket(true)
                .detalle(request.getDetalle())
                .createdBy(user)
                .build();

        ticketRepository.save(ticket);

        return TicketResponse.builder()
                .licensePlate(vehicle.getLicensePlate())
                .type(vehicle.getType().name())
                .entryTime(ticket.getEntryTime())
                .exitTime(ticket.getExitTime())
                .totalAmount(ticket.getTotalAmount())
                .status(ticket.getStatus().name())
                .detalle(ticket.getDetalle())
                .createdBy(user.getUsername())
                .build();
    }

    private double calculateFee(Vehicle v, LocalDateTime entry, LocalDateTime exit) {
        double hours = horas(entry,exit);

        double rate;
        switch (v.getType()) {
            case MOTORCYCLE -> rate = 2;
            case CAR -> rate = 3;
            case LARGE -> rate = 3 * v.getSpaceCount();
            default -> rate = 3;
        }
        return hours * rate;
    }
    private int horas(LocalDateTime entry, LocalDateTime exit) {
        long minutes = Duration.between(entry, exit).toMinutes();

        int hours = (int) (minutes / 60);        // Horas completas
        long extraMinutes = minutes % 60;        // Minutos sobrantes

        // Regla personalizada:
        // Si pasa de 6 minutos → subir 1 hora más
        if (extraMinutes > 5) {
            hours++;
        }

        return Math.max(hours, 1); // mínimo 1 hora
    }
    public LocalDateTime calcularHoraSalida(LocalDateTime horaEntrada, int horasSeleccionadas) {
        return horaEntrada.plusHours(horasSeleccionadas);
    }
    public List<TicketResponse> listAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(t -> TicketResponse.builder()
                        .licensePlate(t.getVehicle().getLicensePlate())
                        .type(t.getVehicle().getType().name())
                        .entryTime(t.getEntryTime())
                        .exitTime(t.getExitTime())
                        .totalAmount(t.getTotalAmount())
                        .status(t.getStatus().name())
                        .detalle(t.getDetalle())
                        .createdBy(t.getCreatedBy().getName())
                        .id(t.getId())
                        .build())
                .collect(Collectors.toList());
    }

    public Ticket getTicketById(Long id){
        return ticketRepository.findById(id).orElse(null);
    }
}