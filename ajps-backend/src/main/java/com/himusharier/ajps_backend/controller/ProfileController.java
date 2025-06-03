package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.*;
import com.himusharier.ajps_backend.exception.UserProfileException;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateUserProfile(@RequestBody @Valid UserProfileUpdateRequest userProfileUpdateRequest) {
        try {
            profileService.updateUserProfile(userProfileUpdateRequest);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.CREATED.value());
            response.put("message", "User profile updated successfully.");
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            throw new UserProfileException("User profile update failed.");
        }
    }

    @GetMapping("/details/{userId}")
    public ResponseEntity<Map<String, Object>> userProfileDetails(@PathVariable Long userId) {
        Profile profile = profileService.userProfileDetailsByUserId(userId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("data", profile);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/picture-upload")
    public ResponseEntity<?> uploadAvatar(@RequestParam("userId") Long userId,
                                          @RequestParam("picture") MultipartFile file) {
        try {
            profileService.saveUserAvatar(userId, file);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("message", "Profile picture uploaded successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "error");
            response.put("code", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Failed to upload profile picture.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> requestEmailChange(@RequestBody EmailChangeRequest request) {
        profileService.requestEmailChange(request.userId(), request.newEmail());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "OTP sent to: " + request.newEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify-email-otp")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody EmailChangeOtpVerifyRequest request) {
        profileService.verifyAndChangeEmail(request.userId(), request.newEmail(), request.otp());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "Email changed successfully.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> passwordChange(@RequestBody PasswordChangeRequest request) {
        profileService.requestPasswordChange(request.userId(), request.userEmail(), request.currentPassword());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "OTP sent to: " + request.userEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify-password-otp")
    public ResponseEntity<?> verifyPasswordOtp(@RequestBody PasswordChangeOtpVerifyRequest request) {
        profileService.verifyAndChangePassword(request.userId(), request.currentPassword(), request.newPassword(), request.otp());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "Password changed successfully.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
