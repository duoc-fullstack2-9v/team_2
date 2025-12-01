package com.tuturno.backend.dto;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @NotBlank
    private String rut;

    @NotBlank
    private String sexo;

    @NotNull
    @Min(1)
    private Integer edad;

    @NotBlank
    @Email
    private String correo;

    @NotBlank
    @Size(min = 6)
    private String password;
}
