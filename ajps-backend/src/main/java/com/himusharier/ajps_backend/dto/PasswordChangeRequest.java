package com.himusharier.ajps_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasswordChangeRequest (
        @NotBlank(message = "User id missing from the request.")
        Long userId,

        @NotBlank(message = "Email cannot be blank.")
        @Email(message = "Email should be valid.")
        String userEmail,

        @NotBlank(message = "Current password cannot be blank.")
        String currentPassword

) {}