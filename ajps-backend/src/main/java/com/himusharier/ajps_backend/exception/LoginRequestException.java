package com.himusharier.ajps_backend.exception;

public class LoginRequestException extends RuntimeException {
    public LoginRequestException(String message) {
        super(message);
    }
}
