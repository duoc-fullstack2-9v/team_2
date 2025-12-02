package com.tuturno.backend.controller;


import com.tuturno.backend.dto.AuthResponse;
import com.tuturno.backend.dto.LoginRequest;
import com.tuturno.backend.dto.RegisterRequest;
import com.tuturno.backend.entity.Usuario;
import com.tuturno.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {


    private final UsuarioService usuarioService;


    // Registro de usuario nuevo
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegisterRequest request) {


        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .rut(request.getRut())
                .sexo(request.getSexo())
                .edad(request.getEdad())
                .correo(request.getCorreo())
                .password(request.getPassword())  // se encripta en el service
                .rol("ROLE_USER")
                .build();


        Usuario creado = usuarioService.registrarUsuario(usuario);


        return ResponseEntity.ok("Usuario registrado con ID: " + creado.getId());
    }


    //login usuario
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {


        Usuario usuario = usuarioService.buscarPorCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas."));


        if (!usuarioService.verificarPassword(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas.");
        }


        // Aquí más adelante generaremos el JWT real.
        // Por ahora devolvemos un token "falso" de ejemplo.
        String tokenFalso = "TOKEN_DEMO_A_REEMPLAZAR_POR_JWT";


        AuthResponse response = new AuthResponse(
                tokenFalso,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getRol()
        );


        return ResponseEntity.ok(response);
    }
}
