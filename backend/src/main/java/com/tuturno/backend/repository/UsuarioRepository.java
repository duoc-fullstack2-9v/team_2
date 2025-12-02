package com.tuturno.backend.repository;

import com.tuturno.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    //buscar ususario por correo (login)
    Optional<Usuario> findByCorreo(String correo);

    //verificar si existe un usuario por correo en la BD (registro)
    boolean existsByCorreo(String correo);
}
