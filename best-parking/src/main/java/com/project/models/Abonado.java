package com.project.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="abonados")
public class Abonado
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="nombre")
    private String nombre;
    @Column(name="placa", nullable=false, unique=true)
    private String placa;
    @Column(name="celular", nullable=false, unique=true)
    private String celular;
    //muchas afiliaciones
    @OneToMany(mappedBy = "abonado", cascade = CascadeType.ALL)
    private List<Afiliacion> afiliaciones;
}