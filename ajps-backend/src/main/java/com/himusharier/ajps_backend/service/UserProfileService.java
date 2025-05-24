package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.dto.UserProfileUpdateRequest;
import com.himusharier.ajps_backend.exception.UserProfileException;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.UserProfile;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.UserProfileRepository;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileService {

    @Value("${app.base.url}")
    private String baseUrl;

    @Value("${upload.avatar.directory}")
    private String uploadDirectory; // Define in application.properties/yml

    private final UserProfileRepository userProfileRepository;
    private final AuthRepository authRepository;
    public UserProfileService(UserProfileRepository userProfileRepository, AuthRepository authRepository) {
        this.userProfileRepository = userProfileRepository;
        this.authRepository = authRepository;
    }

    public UserProfile updateUserProfile(UserProfileUpdateRequest request) {
        // Step 1: Find Auth by userId
        Optional<Auth> optionalAuth = authRepository.findAll().stream()
                .filter(a -> a.getUserId().equals(request.userId()))
                .findFirst();
        if (optionalAuth.isEmpty()) {
            throw new UserProfileException("User not found with user id: " + request.userId());
        }
        Auth auth = optionalAuth.get();

        // Step 2: Fetch existing UserProfile by Auth.id
        UserProfile existingProfile = userProfileRepository.findByAuth_Id(auth.getId())
                .orElseThrow(() -> new UserProfileException("User profile not found for user id: " + request.userId()));

        /*UserProfile updateUserProfile = UserProfile.builder()
                .email(request.email())
                .nameTitle(request.nameTitle())
                .firstName(request.firstName())
                .middleName(request.middleName())
                .lastName(request.lastName())
                .professionalTitle(request.professionalTitle())
                .educationalQualification(request.educationalQualification())
                .institute(request.institute())
                .expertise(request.expertise())
                .mobile(request.mobile())
                .telephone(request.telephone())
                .country(request.country())
                .address(request.address())
                .zipCode(request.zipCode())
                .facebookUrl(request.facebookUrl())
                .twitterUrl(request.twitterUrl())
                .build();
        return userProfileRepository.save(updateUserProfile);*/

        // Step 3: Update the fields
        existingProfile.setEmail(request.email());
        existingProfile.setNameTitle(request.nameTitle());
        existingProfile.setFirstName(request.firstName());
        existingProfile.setMiddleName(request.middleName());
        existingProfile.setLastName(request.lastName());
        existingProfile.setProfessionalTitle(request.professionalTitle());
        existingProfile.setEducationalQualification(request.educationalQualification());
        existingProfile.setInstitute(request.institute());
        existingProfile.setExpertise(request.expertise());
        existingProfile.setMobile(request.mobile());
        existingProfile.setTelephone(request.telephone());
        existingProfile.setCountry(request.country());
        existingProfile.setAddress(request.address());
        existingProfile.setZipCode(request.zipCode());
        existingProfile.setFacebookUrl(request.facebookUrl());
        existingProfile.setTwitterUrl(request.twitterUrl());

        return userProfileRepository.save(existingProfile);

    }

    public UserProfile userProfileDetailsByUserId(Long userId) {
        // Step 1: Find Auth by userId
        Optional<Auth> optionalAuth = authRepository.findByUserId(userId);

        if (optionalAuth.isEmpty()) {
            throw new UserProfileException("User not found with user id: " + userId);
        }

        Auth auth = optionalAuth.get();

        // Step 2: Find UserProfile by Auth ID
        UserProfile profile = userProfileRepository.findByAuth_Id(auth.getId())
                .orElseThrow(() -> new UserProfileException("User profile not found for user id: " + userId));

        // Convert image filename to full URL if exists
        if (profile.getProfileImage() != null && !profile.getProfileImage().startsWith("http")) {
            String fullImageUrl = baseUrl + "/" + uploadDirectory + "/" + profile.getProfileImage();
            profile.setProfileImage(fullImageUrl);
        }

        return profile;
    }

    public void saveUserAvatar(Long userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Empty file.");
        }

        // Step 1: Get Auth
        Auth auth = authRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Auth with userId " + userId + " not found"));

        UserProfile userProfile = auth.getUserProfile();
        if (userProfile == null) {
            throw new RuntimeException("User profile not found for userId " + userId);
        }

        // Step 2: File info and target path
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();

        if (!fileExtension.matches("jpg|jpeg|png|gif|bmp")) {
            throw new RuntimeException("Unsupported image format. Allowed: jpg, jpeg, png, gif, bmp");
        }

        String uniqueFilename = UUID.randomUUID().toString() + "." + fileExtension;
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(uniqueFilename);

        // Step 3: Compress and Save
        try (InputStream input = file.getInputStream();
             OutputStream output = Files.newOutputStream(filePath)) {

            Thumbnails.of(input)
                    .size(200, 200)               // Resize if needed
                    .outputFormat(fileExtension)  // Preserve format
                    .outputQuality(0.6f)          // Compression: 0.0 (highly compressed) to 1.0 (best quality)
                    .toOutputStream(output);
        }

        // Step 4: Update DB
        userProfile.setProfileImage(uniqueFilename);
        userProfile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(userProfile);
    }

}
