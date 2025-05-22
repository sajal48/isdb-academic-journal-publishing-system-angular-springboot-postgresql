package com.himusharier.ajps_backend.dto;

import com.himusharier.ajps_backend.constants.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthResponse {
    private Long id;
    private String email;
    private Role role;
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
}
