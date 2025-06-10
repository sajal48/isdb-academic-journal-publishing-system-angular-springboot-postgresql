package com.himusharier.ajps_backend.dto.response;

import lombok.Data;

@Data
//@JsonInclude(JsonInclude.Include.NON_NULL)  --> added this in application.properties to apply system-wide.
public class SuccessResponseModel<T> {
    String status = "success";
    int code;
    T data;
    String message;

    public SuccessResponseModel(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public SuccessResponseModel(int code, T data) {
        this.data = data;
        this.code = code;
    }

    public SuccessResponseModel(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
