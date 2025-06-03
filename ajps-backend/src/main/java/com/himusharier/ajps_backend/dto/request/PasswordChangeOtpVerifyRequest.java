package com.himusharier.ajps_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record PasswordChangeOtpVerifyRequest(
        @NotBlank(message = "User id missing from the request.")
        Long userId,

        @NotBlank(message = "Current password cannot be blank.")
        String currentPassword,

        @NotBlank(message = "New password cannot be blank.")
        String newPassword,

        @NotBlank(message = "OTP missing from the request.")
        Long otp

) {}