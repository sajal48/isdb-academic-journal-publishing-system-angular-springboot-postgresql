package com.himusharier.ajps_backend.exception;

public class JwtUserAuthenticationException extends RuntimeException {
    public JwtUserAuthenticationException(String message) {
        super(message);
    }
}
