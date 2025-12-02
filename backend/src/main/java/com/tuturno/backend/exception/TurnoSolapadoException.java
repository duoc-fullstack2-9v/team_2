package com.tuturno.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TurnoSolapadoException extends RuntimeException {
    public TurnoSolapadoException(String message) {
        super(message);
    }
}
