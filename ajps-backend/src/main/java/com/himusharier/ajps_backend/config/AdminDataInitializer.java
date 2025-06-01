package com.himusharier.ajps_backend.config;

import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.constants.UserStatus;
import com.himusharier.ajps_backend.exception.RegisterRequestException;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@ajps.com";
        String adminPass = "admin123";

        if (authRepository.findByEmail(adminEmail).isEmpty()) {
            Auth admin = new Auth();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPass)); // use a strong password in real apps
            admin.setUserRole(UserRole.ADMIN);
            admin.setUserStatus(UserStatus.ACTIVE);
            authRepository.save(admin);

            Profile profile = Profile.builder()
                    .auth(admin)
                    .build();
            profileRepository.save(profile);

        } else {
            throw new RegisterRequestException("Admin account not created!");
        }
    }
}
