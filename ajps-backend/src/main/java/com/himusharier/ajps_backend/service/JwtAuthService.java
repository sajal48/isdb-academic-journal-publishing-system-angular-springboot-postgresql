package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.UserStatus;
import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.AuthUserDetails;
import com.himusharier.ajps_backend.model.UserProfile;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.UserProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JwtAuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserProfileRepository userProfileRepository;

    @Autowired
    public JwtAuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder, UserProfileRepository userProfileRepository) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.userProfileRepository = userProfileRepository;
    }

    public List<Auth> getAllUsers() {
        return authRepository.findAll();
    }

    public Optional<Auth> getUserById(Long id) {
        return authRepository.findById(id);
    }

    public List<Auth> getUsersByRole(UserRole userRole) {
        return authRepository.findByRole(userRole);
    }

    @Transactional
    public Auth createAuth(Auth auth) {
        if (authRepository.existsByEmail(auth.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        auth.setPassword(passwordEncoder.encode(auth.getPassword()));
        //auth.setRole(Role.USER); // setting default role as USER
        if (auth.getUserRole() == null) {
            auth.setUserRole(UserRole.USER);
        }
        auth.setUserStatus(UserStatus.ACTIVE);
        auth.setOtpUsed(false);

        Auth saveAuth = authRepository.save(auth);

        // create user profile:
        UserProfile userProfile = new UserProfile();
//        userProfile.setEmail(saveAuth.getEmail());
        userProfile.setAuth(saveAuth);

        userProfileRepository.save(userProfile);

        return saveAuth;
    }

    @Transactional
    public Auth updateUser(Long id, Auth authDetails) {
        Auth auth = authRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Only update email if it has changed and is not already in use
        if (!auth.getEmail().equals(authDetails.getEmail())) {
            if (authRepository.existsByEmail(authDetails.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            auth.setEmail(authDetails.getEmail());
        }

        // Update password if provided
        if (authDetails.getPassword() != null && !authDetails.getPassword().isEmpty()) {
            auth.setPassword(passwordEncoder.encode(authDetails.getPassword()));
        }

        // Update role if provided
        if (authDetails.getUserRole() != null) {
            auth.setUserRole(authDetails.getUserRole());
        }

        return authRepository.save(auth);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!authRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }

        authRepository.deleteById(id);
    }

    public Auth getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        if (authentication.getPrincipal() instanceof AuthUserDetails) {
            return ((AuthUserDetails) authentication.getPrincipal()).auth();
        }

        return null;
    }

    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        Auth auth = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (!passwordEncoder.matches(currentPassword, auth.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        auth.setPassword(passwordEncoder.encode(newPassword));

        authRepository.save(auth);
    }

    public UserDetails loadUserByUsername(String username) {
        Optional<Auth> byEmail = authRepository.findByEmail(username);
        return byEmail.map(AuthUserDetails::new).orElse(null);
    }
}
