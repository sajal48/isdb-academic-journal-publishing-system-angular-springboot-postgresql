package com.himusharier.ajps_backend.dto;

import com.himusharier.ajps_backend.annotation.ValidRole;
import com.himusharier.ajps_backend.constants.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Email cannot be blank.")
        @Email(message = "Email should be valid.")
        String email,

        @NotBlank(message = "Password cannot be blank.")
        @Size(min = 6, message = "Password must be at least 6 characters.")
        String password

//        @ValidRole(message = "Role must be valid")
//        Role role
) {
}
