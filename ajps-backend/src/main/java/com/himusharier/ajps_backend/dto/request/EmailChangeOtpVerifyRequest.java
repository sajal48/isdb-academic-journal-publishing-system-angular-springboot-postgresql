package com.himusharier.ajps_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailChangeOtpVerifyRequest(
        @NotBlank(message = "User id missing from the request.")
        Long userId,

        @NotBlank(message = "Email cannot be blank.")
        @Email(message = "Email should be valid.")
        String newEmail,

        @NotBlank(message = "OTP code is required.")
        Long otp

) {}