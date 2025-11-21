package com.project.dto;


import com.project.models.Afiliacion;
import lombok.*;

import java.util.List;
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AbonadoRequest {
    private Long id;
    private String nombre;
    private String placa;
    private String celular;
    private List<Afiliacion> afiliaciones;
}
