package com.tuturno.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "turnos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    //fecha y hora de inicio
    private LocalDateTime inicioTurno;

    // fecha y hora de termino del turno
    private LocalDateTime finTurno;

    //turno dia completo
    private boolean turnoDiaCompleto;

    //relacion 1->N 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
