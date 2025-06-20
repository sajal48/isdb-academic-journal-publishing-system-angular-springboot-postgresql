package com.himusharier.ajps_backend.dto.request;

import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.constants.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminCreateUserRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private UserRole userRole;
    private UserStatus userStatus;
    private boolean sendEmail;
}