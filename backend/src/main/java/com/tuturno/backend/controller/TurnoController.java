package com.tuturno.backend.controller;

import com.tuturno.backend.dto.TurnoRequest;
import com.tuturno.backend.dto.TurnoResponse;
import com.tuturno.backend.entity.Turno;
import com.tuturno.backend.service.TurnoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turnos") 
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TurnoController {

    private final TurnoService turnoService;

    // Crear turno
    @PostMapping
    public ResponseEntity<TurnoResponse> crearTurno(@Valid @RequestBody TurnoRequest request) {

        Turno turno = turnoService.crearTurno(
                request.getUsuarioId(),
                request.getInicioTurno(),
                request.getFinTurno(),
                request.getTitulo(),
                request.isTurnoDiaCompleto()
        );

        TurnoResponse response = new TurnoResponse(
                turno.getId(),
                turno.getTitulo(),
                turno.getInicioTurno(),
                turno.getFinTurno(),
                turno.isTurnoDiaCompleto(),
                turno.getUsuario().getId()
        );

        return ResponseEntity.ok(response);
    }

    // Listar turnos de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<TurnoResponse>> obtenerTurnos(@PathVariable Long usuarioId) {
        List<TurnoResponse> turnos = turnoService.obtenerTurnosDeUsuario(usuarioId)
                .stream()
                .map(t -> new TurnoResponse(
                        t.getId(),
                        t.getTitulo(),
                        t.getInicioTurno(),
                        t.getFinTurno(),
                        t.isTurnoDiaCompleto(),
                        t.getUsuario().getId()
                ))
                .toList();

        return ResponseEntity.ok(turnos);
    }

    // Eliminar turno
    @DeleteMapping("/{turnoId}")
    public ResponseEntity<Void> eliminarTurno(
            @PathVariable Long turnoId,
            @RequestParam Long usuarioId) {

        turnoService.eliminarTurno(turnoId, usuarioId);
        return ResponseEntity.noContent().build();
    }

        //actualizar turno existente
    @PutMapping("/{turnoId}")
    public ResponseEntity<TurnoResponse> actualizarTurno(
            @PathVariable Long turnoId,
            @RequestParam Long usuarioId,
            @Valid @RequestBody TurnoRequest request) {

        Turno turnoActualizado = turnoService.actualizarTurno(
                turnoId,
                usuarioId,
                request.getInicioTurno(),
                request.getFinTurno(),
                request.getTitulo(),
                request.isTurnoDiaCompleto()
        );

        TurnoResponse response = new TurnoResponse(
                turnoActualizado.getId(),
                turnoActualizado.getTitulo(),
                turnoActualizado.getInicioTurno(),
                turnoActualizado.getFinTurno(),
                turnoActualizado.isTurnoDiaCompleto(),
                turnoActualizado.getUsuario().getId()
        );

        return ResponseEntity.ok(response);
    }

}
