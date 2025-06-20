package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.AdminCreateUserRequest;
import com.himusharier.ajps_backend.dto.request.AdminUpdateUserRequest;
import com.himusharier.ajps_backend.dto.response.AdminUserListResponseDto;
import com.himusharier.ajps_backend.dto.response.ApiResponse;
import com.himusharier.ajps_backend.exception.UserProfileException;
import com.himusharier.ajps_backend.service.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/create-new-user")
    public ResponseEntity<?> createUser(@RequestBody AdminCreateUserRequest request) {
        try {
            adminService.createUser(request);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.CREATED.value());
            response.put("message", "User created successfully.");
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            throw new UserProfileException("User not created!");
        }
    }

    @GetMapping("/get-user-details")
    public ApiResponse<List<AdminUserListResponseDto>> getAllUsers() {
        List<AdminUserListResponseDto> users = adminService.getAllUsers();
        return new ApiResponse<>(200, "Users fetched successfully", users);
    }

    /*@PutMapping("/update-user-details/{id}")
    public ApiResponse<AdminUserListResponseDto> updateUser(@PathVariable Long id, @RequestBody AdminUserListResponseDto dto) {
        AdminUserListResponseDto updatedUser = adminService.updateUser(id, dto);
        return new ApiResponse<>(200, "User updated successfully", updatedUser);
    }*/

    @PutMapping("/update-user-details/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody AdminUpdateUserRequest dto) {
        try {
            adminService.updateUser(id, dto);
            return ResponseEntity.ok(new ApiResponse(200, "User updated successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(404, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(500, "Failed to update user"));
        }
    }

}
