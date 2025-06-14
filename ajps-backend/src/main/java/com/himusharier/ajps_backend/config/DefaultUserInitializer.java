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
public class DefaultUserInitializer implements CommandLineRunner {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@mail.com";
        String adminPass = "admin123";

        String userEmail = "user@mail.com";
        String userPass = "user123";

        String editorEmail = "editor@mail.com";
        String editorPass = "editor123";

        String reviewerEmail = "reviewer@mail.com";
        String reviewerPass = "reviewer123";

        try {
            if (authRepository.findByEmail(adminEmail).isEmpty()) {
                Auth admin = new Auth();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPass));
                admin.setUserRole(UserRole.ADMIN);
                admin.setUserStatus(UserStatus.ACTIVE);
                authRepository.save(admin);
                Profile profile = Profile.builder()
                        .auth(admin)
                        .build();
                profileRepository.save(profile);
            }

            if (authRepository.findByEmail(userEmail).isEmpty()) {
                Auth user = new Auth();
                user.setEmail(userEmail);
                user.setPassword(passwordEncoder.encode(userPass));
                user.setUserRole(UserRole.USER);
                user.setUserStatus(UserStatus.ACTIVE);
                authRepository.save(user);
                Profile profile = Profile.builder()
                        .auth(user)
                        .build();
                profileRepository.save(profile);
            }

            if (authRepository.findByEmail(editorEmail).isEmpty()) {
                Auth editor = new Auth();
                editor.setEmail(editorEmail);
                editor.setPassword(passwordEncoder.encode(editorPass));
                editor.setUserRole(UserRole.EDITOR);
                editor.setUserStatus(UserStatus.ACTIVE);
                authRepository.save(editor);
                Profile profile = Profile.builder()
                        .auth(editor)
                        .build();
                profileRepository.save(profile);
            }

            if (authRepository.findByEmail(reviewerEmail).isEmpty()) {
                Auth reviewer = new Auth();
                reviewer.setEmail(reviewerEmail);
                reviewer.setPassword(passwordEncoder.encode(reviewerPass));
                reviewer.setUserRole(UserRole.REVIEWER);
                reviewer.setUserStatus(UserStatus.ACTIVE);
                authRepository.save(reviewer);
                Profile profile = Profile.builder()
                        .auth(reviewer)
                        .build();
                profileRepository.save(profile);
            }

        } catch (RuntimeException e) {
            throw new RegisterRequestException("Default accounts not created!");
        }
    }
}
