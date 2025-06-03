package com.himusharier.ajps_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailChangeRequest (
        @NotBlank(message = "User id missing from the request.")
        Long userId,

        @NotBlank(message = "Email cannot be blank.")
        @Email(message = "Email should be valid.")
        String newEmail

) {}