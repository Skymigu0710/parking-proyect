package com.project.dto;
import lombok.*;

import java.time.LocalDate;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AfiliacionRequest {
    private Long abonadoId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private int mes;
    private double Monto;
}