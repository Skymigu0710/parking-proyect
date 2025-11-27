package com.project.models;

 import com.fasterxml.jackson.annotation.JsonIgnore;
 import jakarta.persistence.*;
 import lombok.*;

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
    @ManyToOne
    @JoinColumn(name = "afiliacion_id")
    @JsonIgnore
    private Afiliacion afiliacion;
}