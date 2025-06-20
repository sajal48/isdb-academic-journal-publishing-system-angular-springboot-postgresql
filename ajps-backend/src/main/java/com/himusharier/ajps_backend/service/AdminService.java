package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.constants.UserStatus;
import com.himusharier.ajps_backend.dto.request.AdminCreateUserRequest;
import com.himusharier.ajps_backend.dto.request.AdminUpdateUserRequest;
import com.himusharier.ajps_backend.dto.response.AdminUserListResponseDto;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.ProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AuthRepository authRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService (
            AuthRepository authRepository,
            ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authRepository = authRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createUser(AdminCreateUserRequest request) {
        // 1. Generate password
        String generatedPassword = UUID.randomUUID().toString().substring(0, 8);

        // 2. Create Auth record
        Auth auth = Auth.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(generatedPassword))
                .userRole(request.getUserRole())
                .userStatus(UserStatus.ACTIVE)
                .build();

        auth = authRepository.save(auth);

        // 3. Create Profile record
        Profile profile = Profile.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .auth(auth)
                .build();

        profileRepository.save(profile);

        // 4. Optionally send email
        if (request.isSendEmail()) {
            String body = "Welcome!\nEmail: " + request.getEmail() +
                    "\nPassword: " + generatedPassword;
            System.out.println(body);
//            emailService.sendSimpleMessage(request.getEmail(), "Your AJPS Account Credentials", body);
        }
    }

    public List<AdminUserListResponseDto> getAllUsers() {
        List<Auth> authList = authRepository.findAll();

        return authList.stream().map(auth -> {
            AdminUserListResponseDto dto = new AdminUserListResponseDto();
            dto.setId(auth.getId());
            dto.setEmail(auth.getEmail());
            dto.setRole(auth.getUserRole().name());
            dto.setStatus(auth.getUserStatus().name());

            if (auth.getProfile() != null) {
                dto.setFirstName(auth.getProfile().getFirstName());
                dto.setMiddleName(auth.getProfile().getMiddleName());
                dto.setLastName(auth.getProfile().getLastName());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateUser(Long authId, AdminUpdateUserRequest dto) {
        // Fetch Auth entity
        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + authId));

        // Update Auth fields
        auth.setEmail(dto.getEmail());
        try {
            auth.setUserRole(UserRole.valueOf(dto.getUserRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + dto.getUserRole());
        }

        try {
            auth.setUserStatus(UserStatus.valueOf(dto.getStatus().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + dto.getStatus());
        }

        // Update Profile fields (if exists)
        Profile profile = auth.getProfile();
        if (profile != null) {
            profile.setFirstName(dto.getFirstName());
            profile.setMiddleName(dto.getMiddleName());
            profile.setLastName(dto.getLastName());
        } else {
            // Create profile if not present (optional)
            profile = new Profile();
            profile.setAuth(auth);
            profile.setFirstName(dto.getFirstName());
            profile.setMiddleName(dto.getMiddleName());
            profile.setLastName(dto.getLastName());
            auth.setProfile(profile);
        }

        // Save Auth (which cascades profile)
        authRepository.save(auth);

        // Optional: handle email sending
        if (dto.isSendEmail()) {
            // emailService.sendUserUpdateNotification(auth); // Uncomment and implement if needed
        }
    }


}
