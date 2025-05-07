package com.himusharier.ajps_backend.validator;

import com.himusharier.ajps_backend.annotation.ValidRole;
import com.himusharier.ajps_backend.constants.Role;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RoleValidator implements ConstraintValidator<ValidRole, Role> {
    @Override
    public boolean isValid(Role role, ConstraintValidatorContext context) {
        if (role == null) {
            return false;
        }
        try {
            Role.valueOf(role.name());
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
