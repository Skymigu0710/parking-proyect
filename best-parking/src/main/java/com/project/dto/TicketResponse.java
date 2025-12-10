package com.project.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponse {
    private Long id;
    private String licensePlate;
    private String type;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Double totalAmount;
    private String status;
    private String detalle;
    private int horas;
    private String createdBy;
}