package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.dto.UserProfileUpdateRequest;
import com.himusharier.ajps_backend.exception.UserProfileException;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.UserProfile;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

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
        return userProfileRepository.findByAuth_Id(auth.getId())
                .orElseThrow(() -> new UserProfileException("User profile not found for user id: " + userId));

    }
}
