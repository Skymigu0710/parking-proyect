package com.project.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private Double totalAmount;

    private Double discountAmount;
    private Double manualAmount;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private boolean specialTicket=false;

    private String detalle;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

}