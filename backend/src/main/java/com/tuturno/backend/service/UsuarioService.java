package com.tuturno.backend.service;

import com.tuturno.backend.entity.Usuario;
import com.tuturno.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    //crear usuario nuevo
    public Usuario registrarUsuario(Usuario usuario) {

        // validar que el correo no exista 
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalStateException("Ya existe un usuario con ese correo.");
        }

        // encriptar la contraseña
        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);

        // asignar rol por defecto si viene vacío
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("ROLE_USER");
        }

        return usuarioRepository.save(usuario);
    }

    //buscar usuario por correo (login)
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    //buscar usuario por id
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    //verificar password en login
    public boolean verificarPassword(String passwordPlano, String passwordEncriptada) {
        return passwordEncoder.matches(passwordPlano, passwordEncriptada);
    }
}

