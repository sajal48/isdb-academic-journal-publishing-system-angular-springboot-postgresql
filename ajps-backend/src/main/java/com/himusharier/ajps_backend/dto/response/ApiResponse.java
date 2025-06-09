package com.himusharier.ajps_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse<T> {
    private int code;
    private String status;
    private T data;

    public ApiResponse(int code, String status, T data) {
        this.code = code;
        this.status = status;
        this.data = data;
    }

    public ApiResponse(int code, String status) {
        this.code = code;
        this.status = status;
    }

    // Getters and Setters
}
