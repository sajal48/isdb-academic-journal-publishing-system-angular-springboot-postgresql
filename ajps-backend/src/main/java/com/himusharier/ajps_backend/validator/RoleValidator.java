package com.himusharier.ajps_backend.validator;

import com.himusharier.ajps_backend.annotation.ValidRole;
import com.himusharier.ajps_backend.constants.UserRole;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RoleValidator implements ConstraintValidator<ValidRole, UserRole> {
    @Override
    public boolean isValid(UserRole userRole, ConstraintValidatorContext context) {
        if (userRole == null) {
            return false;
        }
        try {
            UserRole.valueOf(userRole.name());
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
