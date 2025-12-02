package com.tuturno.backend.repository;

import com.tuturno.backend.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

    // turnos de un usuario
    List<Turno> findByUsuarioId(Long usuarioId);

    // evitar turnos solapados al CREAR
    List<Turno> findByUsuarioIdAndInicioTurnoLessThanEqualAndFinTurnoGreaterThanEqual(
            Long usuarioId,
            LocalDateTime finTurno,
            LocalDateTime inicioTurno
    );

    // evitar turnos solapados al EDITAR
    List<Turno> findByUsuarioIdAndIdNotAndInicioTurnoLessThanEqualAndFinTurnoGreaterThanEqual(
            Long usuarioId,
            Long idExcluir,
            LocalDateTime finTurno,
            LocalDateTime inicioTurno
    );
}
