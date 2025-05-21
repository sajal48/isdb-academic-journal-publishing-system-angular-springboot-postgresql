package com.himusharier.ajps_backend.advice;

import com.himusharier.ajps_backend.exception.LoginRequestException;
import com.himusharier.ajps_backend.exception.RegisterRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandler {

//    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleInvalidArgument(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            response.put("status", "error");
            response.put("code", HttpStatus.BAD_REQUEST.value());
//            response.put(error.getField(), error.getDefaultMessage());
            response.put("message", error.getDefaultMessage());
        });
        return response;
    }

//    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RegisterRequestException.class)
    public Map<String, Object> registerRequestException(RegisterRequestException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "error");
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("message", ex.getMessage());
        return response;
    }

//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Map<String, Object> messageNotReadableException(HttpMessageNotReadableException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "error");
        response.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("message", "Internal server error");
        return response;
    }

    @ExceptionHandler(LoginRequestException.class)
    public Map<String, Object> authenticationException(LoginRequestException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "error");
        response.put("code", HttpStatus.UNAUTHORIZED.value());
        response.put("message", "Invalid email or password.");
        return response;
    }

}
