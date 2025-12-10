package com.project.models;

 import com.fasterxml.jackson.annotation.JsonIgnore;
 import jakarta.persistence.*;
 import lombok.*;

 import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pagos_mensuales")
public class PagoMensual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int mes;   // cada numero representa al mes del añoo
    private int año;
    private double monto;
    private boolean pagado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    @ManyToOne
    @JoinColumn(name = "afiliacion_id")
    @JsonIgnore
    private Afiliacion afiliacion;
}