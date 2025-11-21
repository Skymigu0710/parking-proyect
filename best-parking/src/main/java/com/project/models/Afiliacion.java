package com.project.models;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "afiliaciones")
public class Afiliacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "abonado_id")
    private Abonado abonado;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private boolean activa;
    private double monto;
    // Relación con pagos mensuales
    @OneToMany(mappedBy = "afiliacion", cascade = CascadeType.ALL)
    private List<PagoMensual> pagos;
}
