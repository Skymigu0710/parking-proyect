package com.project.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CuotaRequest {

        private Long afiliacionId;
        private double montoMensual;
        private int meses;
        private int añoInicio;
    }
