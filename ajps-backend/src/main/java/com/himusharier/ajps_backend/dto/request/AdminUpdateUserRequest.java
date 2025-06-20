package com.himusharier.ajps_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateUserRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String userRole;  // Should be an enum string like "ADMIN", "USER"
    private String status;    // Should be "ACTIVE", "SUSPENDED", "DELETED"
    private boolean sendEmail;
}