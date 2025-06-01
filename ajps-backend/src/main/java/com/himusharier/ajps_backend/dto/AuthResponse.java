package com.himusharier.ajps_backend.dto;

import com.himusharier.ajps_backend.constants.UserRole;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthResponse {
    private Long id;
    private String email;
    private UserRole userRole;
    private LocalDateTime createdAt;
    //private LocalDateTime updatedAt;
}
