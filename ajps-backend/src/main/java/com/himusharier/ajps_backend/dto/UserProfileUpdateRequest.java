package com.himusharier.ajps_backend.dto;

import com.himusharier.ajps_backend.model.Auth;
import jakarta.validation.constraints.*;

public record UserProfileUpdateRequest(
        @NotNull(message = "User id missing from the request.")
        Long userId,

        //@NotBlank(message = "Email is required")
//        @Email(message = "Invalid email format")
//        String email,

        String nameTitle,
        String firstName,
        String middleName,
        String lastName,
        String professionalTitle,
        String educationalQualification,
        String institute,
        String expertise,

        //@Pattern(regexp = "^\\+?[0-9\\-\\s]{7,15}$", message = "Invalid mobile number")
        // Modified: Accepts an empty string OR the phone number pattern
        @Pattern(regexp = "^$|^\\+?[0-9\\s]{7,15}$", message = "Invalid mobile number")
        String mobile,

        // Modified: Accepts an empty string OR the phone number pattern
        @Pattern(regexp = "^$|^\\+?[0-9\\s]{7,15}$", message = "Invalid telephone number")
        String telephone,

        String country,
        String address,

        @Pattern(regexp = "^[0-9A-Za-z\\s-]{3,10}$", message = "Invalid zip code")
        String zipCode,

        // Modified: Accepts an empty string OR the Facebook URL pattern
        @Pattern(regexp = "^$|^(https?://)?(www\\.)?facebook\\.com/.*$", message = "Invalid Facebook URL")
        String facebookUrl,

        // Modified: Accepts an empty string OR the Twitter URL pattern
        @Pattern(regexp = "^$|^(https?://)?(www\\.)?twitter\\.com/.*$", message = "Invalid Twitter URL")
        String twitterUrl

) {}
