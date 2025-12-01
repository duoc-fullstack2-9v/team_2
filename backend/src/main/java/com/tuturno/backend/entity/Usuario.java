package com.tuturno.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //ID autoincremental
    private Long id;

    private String nombre;
    private String apellido;
    private String rut;
    private String sexo;
    private Integer edad;

    @Column(unique = true, nullable = false) //Correo único y no nulo
    private String correo;

    @Column(nullable = false) //Contraseña no nula
    private String password; 

    @Column(nullable = false) //Rol no nulo
    private String rol;
}
