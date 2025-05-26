package com.himusharier.ajps_backend.dto;

import java.util.List; // For the list of reviewers

/**
 * Represents a manuscript submission as an immutable Java Record.
 * This record is ideal for use as a Data Transfer Object (DTO)
 * for passing data between application layers (e.g., from controller to service,
 * or as a response object).
 *
 * IMPORTANT: Java Records are generally NOT directly supported as JPA @Entity classes
 * for database persistence. For JPA entities, you should use a traditional class.
 *
 * The 'manuscriptFile' field now holds the Base64 encoded content of the file.
 * The 'fileName' field holds the original name of the file.
 * The 'reviewers' field is represented as a List of ReviewerDTO objects.
 */
public record ManuscriptSubmissionDTO(
        String journal,
        String articleTitle,
        String articleCategory,
        String abstractContent, // Renamed from 'abstract' to avoid Java keyword conflict
        String keywords,
        String correspondingAuthor,
        String authorEmail,
        String institution,
        String manuscriptFile, // Changed from 'manuscriptFilePathOrUrl' to 'manuscriptFile' for Base64 content
        String fileName, // Original file name
        List<ReviewerDTO> reviewers, // Changed field name from 'reviewerDTOS' to 'reviewers' for consistency
        String comments
) {
    // Records automatically generate a canonical constructor, getters, equals(), hashCode(), and toString().
    // You can add custom methods or validations here if needed.

    // Example of a custom validation (can be done in a service layer as well)
    public ManuscriptSubmissionDTO {
        if (journal == null || journal.trim().isEmpty()) {
            throw new IllegalArgumentException("Journal cannot be blank.");
        }
        // Add similar validations for other required fields if desired
        // For example, you might want to validate that manuscriptFile and fileName are not null/empty
        // if they are considered mandatory at the DTO level.
    }
}
