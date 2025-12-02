package com.tuturno.backend.service;

import com.tuturno.backend.entity.Turno;
import com.tuturno.backend.entity.Usuario;
import com.tuturno.backend.exception.TurnoSolapadoException;
import com.tuturno.backend.repository.TurnoRepository;
import com.tuturno.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final UsuarioRepository usuarioRepository;

    public Turno crearTurno(Long usuarioId,
            LocalDateTime inicioTurno,
            LocalDateTime finTurno,
            String titulo,
            boolean turnoDiaCompleto) {

        if (!inicioTurno.isBefore(finTurno)) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin.");
        }

        // Buscar turnos solapados
        List<Turno> solapados = turnoRepository.findByUsuarioIdAndInicioTurnoLessThanEqualAndFinTurnoGreaterThanEqual(
                usuarioId,
                finTurno,
                inicioTurno);

        if (!solapados.isEmpty()) {
            throw new TurnoSolapadoException("Los turnos no pueden solaparse.");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        Turno turno = Turno.builder()
                .titulo(titulo)
                .inicioTurno(inicioTurno)
                .finTurno(finTurno)
                .turnoDiaCompleto(turnoDiaCompleto)
                .usuario(usuario)
                .build();

        return turnoRepository.save(turno);
    }

    public Turno actualizarTurno(
            Long turnoId,
            Long usuarioId,
            LocalDateTime inicioTurno,
            LocalDateTime finTurno,
            String titulo,
            boolean turnoDiaCompleto) {

        if (!inicioTurno.isBefore(finTurno)) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin.");
        }

        // busca turno existente
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado."));

        // valida que el turno es del usuario
        if (!turno.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalStateException("No tiene permisos para modificar este turno.");
        }

        // verifica solapamiento con otros turnos del mismo usuario menos el actual
        List<Turno> solapados = turnoRepository
                .findByUsuarioIdAndIdNotAndInicioTurnoLessThanEqualAndFinTurnoGreaterThanEqual(
                        usuarioId,
                        turnoId,
                        finTurno,
                        inicioTurno);

        if (!solapados.isEmpty()) {
            throw new TurnoSolapadoException("Los turnos no pueden solaparse.");
        }

        // actualiza datos
        turno.setTitulo(titulo);
        turno.setInicioTurno(inicioTurno);
        turno.setFinTurno(finTurno);
        turno.setTurnoDiaCompleto(turnoDiaCompleto);

        return turnoRepository.save(turno);
    }

    public List<Turno> obtenerTurnosDeUsuario(Long usuarioId) {
        return turnoRepository.findByUsuarioId(usuarioId);
    }

    public void eliminarTurno(Long turnoId, Long usuarioId) {
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado."));

        // Validar que el turno pertenece al usuario
        if (!turno.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalStateException("No tiene permisos para eliminar este turno.");
        }

        turnoRepository.delete(turno);
    }
}
