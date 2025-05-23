package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.UserProfileUpdateRequest;
import com.himusharier.ajps_backend.exception.UserProfileException;
import com.himusharier.ajps_backend.model.UserProfile;
import com.himusharier.ajps_backend.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            UserProfile updateProfile = userProfileService.updateUserProfile(userProfileUpdateRequest);

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

        UserProfile userProfile = userProfileService.userProfileDetailsByUserId(userId);

        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("data", userProfile);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
