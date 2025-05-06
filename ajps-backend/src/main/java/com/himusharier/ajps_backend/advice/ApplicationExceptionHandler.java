package com.himusharier.ajps_backend.advice;

import com.himusharier.ajps_backend.exception.RegisterRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleInvalidArgument(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            response.put("status", "error");
            response.put("code", HttpStatus.BAD_REQUEST.value());
            response.put(error.getField(), error.getDefaultMessage());
        });
        return response;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RegisterRequestException.class)
    public Map<String, Object> handleBookAddingException(RegisterRequestException ex) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "error");
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("message", ex.getMessage());
        return response;
    }

}
