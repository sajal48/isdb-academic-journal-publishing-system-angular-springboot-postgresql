package com.himusharier.ajps_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserListResponseDto {
    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String role;
    private String status;
}