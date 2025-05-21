package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.Role;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.AuthUserDetails;
import com.himusharier.ajps_backend.repository.AuthRepository;
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

    @Autowired
    public JwtAuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Auth> getAllUsers() {
        return authRepository.findAll();
    }

    public Optional<Auth> getUserById(Long id) {
        return authRepository.findById(id);
    }

    public List<Auth> getUsersByRole(Role role) {
        return authRepository.findByRole(role);
    }

    @Transactional
    public Auth createAuth(Auth auth) {
        if (authRepository.existsByEmail(auth.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        auth.setPassword(passwordEncoder.encode(auth.getPassword()));
        //auth.setRole(Role.USER); // setting default role as USER
        if (auth.getRole() == null) {
            auth.setRole(Role.USER);
        }

        return authRepository.save(auth);
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
        if (authDetails.getRole() != null) {
            auth.setRole(authDetails.getRole());
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
