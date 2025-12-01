package com.tuturno.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TurnoRequest {             //recibe turno del frontend

    @NotBlank
    private String titulo;

    @NotNull
    private LocalDateTime inicioTurno;

    @NotNull
    private LocalDateTime finTurno;

    private boolean turnoDiaCompleto;

    // Por ahora lo mandaremos desde el front.
    // Más adelante lo sacaremos del JWT.
    @NotNull
    private Long usuarioId;
}
