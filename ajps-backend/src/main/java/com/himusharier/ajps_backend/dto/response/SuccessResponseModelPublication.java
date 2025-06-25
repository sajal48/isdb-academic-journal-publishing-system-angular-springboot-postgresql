package com.himusharier.ajps_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuccessResponseModelPublication<T> {
    private int code;
    private String status;
    private String message;
    private T data; // Generic data payload

    public SuccessResponseModelPublication(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.status = (code >= 200 && code < 300) ? "success" : "error";
    }
}
