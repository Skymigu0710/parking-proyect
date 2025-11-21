package com.project.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AfiliacionResponse {
    private Long id;
    private String fechaInicio;
    private String fechaFin;
    private boolean activa;
    private double monto;
}
