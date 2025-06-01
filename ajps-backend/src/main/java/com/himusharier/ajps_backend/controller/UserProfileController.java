package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.*;
import com.himusharier.ajps_backend.exception.UserProfileException;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateUserProfile(@RequestBody @Valid UserProfileUpdateRequest userProfileUpdateRequest) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            Profile updateProfile = userProfileService.updateUserProfile(userProfileUpdateRequest);

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
        Map<String, Object> response = new LinkedHashMap<>();

        Profile profile = userProfileService.userProfileDetailsByUserId(userId);

        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("data", profile);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAvatar(@RequestParam("userId") Long userId,
                                          @RequestParam("picture") MultipartFile file) {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            userProfileService.saveUserAvatar(userId, file);

            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("message", "Profile picture uploaded successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);
//            return ResponseEntity.ok(Map.of("message", "Profile picture uploaded successfully"));
        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to upload profile picture."));
            response.put("status", "error");
            response.put("code", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Failed to upload profile picture.");

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> requestEmailChange(@RequestBody EmailChangeRequest request) {
        userProfileService.requestEmailChange(request.userId(), request.newEmail());
//        return ResponseEntity.ok("OTP sent to new email");
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "OTP sent to: " + request.newEmail());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify-email-otp")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody EmailChangeOtpVerifyRequest request) {
        userProfileService.verifyAndChangeEmail(request.userId(), request.newEmail(), request.otp());
//        return ResponseEntity.ok("Email changed successfully");
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "Email changed successfully.");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> passwordChange(@RequestBody PasswordChangeRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();

        userProfileService.requestPasswordChange(request.userId(), request.userEmail(), request.currentPassword());
//            return ResponseEntity.ok("Password changed successfully");
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "OTP sent to: " + request.userEmail());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify-password-otp")
    public ResponseEntity<?> verifyPasswordOtp(@RequestBody PasswordChangeOtpVerifyRequest request) {
        userProfileService.verifyAndChangePassword(request.userId(), request.currentPassword(), request.newPassword(), request.otp());
//        return ResponseEntity.ok("Email changed successfully");
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "Password changed successfully.");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
