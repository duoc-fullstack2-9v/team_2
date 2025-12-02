package com.tuturno.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TurnoResponse {

    private Long id;
    private String titulo;
    private LocalDateTime inicioTurno;
    private LocalDateTime finTurno;
    private boolean turnoDiaCompleto;
    private Long usuarioId;
}
