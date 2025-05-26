package com.himusharier.ajps_backend.service.impl; // Adjust package as per your project structure

import com.himusharier.ajps_backend.dto.ManuscriptSubmissionDTO;
import com.himusharier.ajps_backend.dto.ReviewerDTO; // Import ReviewerDTO
import com.himusharier.ajps_backend.model.ManuscriptSubmission; // Alias for the entity class
import com.himusharier.ajps_backend.repository.ManuscriptSubmissionRepository;
import com.himusharier.ajps_backend.service.ManuscriptSubmissionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64; // For Base64 decoding
import java.util.List;
import java.util.Optional;
import java.util.UUID; // For generating unique file names

/**
 * Implementation of the ManuscriptSubmissionService.
 * Handles file storage and interaction with the database repository for
 * manuscript submission operations (create, read, update, delete).
 */
@Service
public class ManuscriptSubmissionServiceImpl implements ManuscriptSubmissionService {

    private final ManuscriptSubmissionRepository submissionRepository;
    private final ObjectMapper objectMapper; // Injected for JSON serialization/deserialization
    private final String uploadDir = "uploads/manuscripts"; // Configurable upload directory

    /**
     * Constructor for dependency injection.
     *
     * @param submissionRepository The JPA repository for ManuscriptSubmission entities.
     * @param objectMapper ObjectMapper for JSON serialization/deserialization.
     */
    public ManuscriptSubmissionServiceImpl(ManuscriptSubmissionRepository submissionRepository, ObjectMapper objectMapper) {
        this.submissionRepository = submissionRepository;
        this.objectMapper = objectMapper;
        // Ensure the upload directory exists on application startup
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            // Log the error or throw a runtime exception if directory creation fails
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    /**
     * Processes a new manuscript submission.
     * 1. Decodes the Base64 file content.
     * 2. Stores the decoded file to the file system.
     * 3. Creates a JPA entity from the DTO and persists it to the database.
     *
     * @param submissionDto The DTO containing manuscript details, including the Base64 file content.
     * @return The path or URL where the manuscript file was stored.
     * @throws IOException If there's an error decoding Base64 or storing the file.
     * @throws IllegalArgumentException If there's a validation error or issue with data.
     */
    @Override
    public String processManuscriptSubmission(ManuscriptSubmissionDTO submissionDto) throws IOException {
        // --- 1. Decode Base64 file content and store the file ---
        String base64FileContent = submissionDto.manuscriptFile();
        String originalFileName = submissionDto.fileName();

        if (base64FileContent == null || base64FileContent.trim().isEmpty()) {
            throw new IllegalArgumentException("Manuscript file content (Base64) is missing.");
        }
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new IllegalArgumentException("Original file name is missing.");
        }

        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        String base64Data = base64FileContent.substring(base64FileContent.indexOf(",") + 1);
        byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

        // Generate a unique file name to prevent conflicts
        String fileExtension = "";
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = Paths.get(uploadDir).resolve(uniqueFileName);

        // Write the decoded bytes to the file system
//        Files.write(filePath, decodedBytes, StandardCopyOption.REPLACE_EXISTING);

        String manuscriptFilePathOrUrl = filePath.toAbsolutePath().toString(); // Store the absolute path

        // --- 2. Create and Save the JPA Entity ---
        ManuscriptSubmission entity = new ManuscriptSubmission();
        entity.setJournal(submissionDto.journal());
        entity.setArticleTitle(submissionDto.articleTitle());
        entity.setArticleCategory(submissionDto.articleCategory());
        entity.setAbstractContent(submissionDto.abstractContent());
        entity.setKeywords(submissionDto.keywords());
        entity.setCorrespondingAuthor(submissionDto.correspondingAuthor());
        entity.setAuthorEmail(submissionDto.authorEmail());
        entity.setInstitution(submissionDto.institution());
        entity.setManuscriptFilePathOrUrl(manuscriptFilePathOrUrl); // Set the stored file path
        entity.setFileName(originalFileName); // Original file name

        try {
            // Convert List<ReviewerDTO> from DTO to JSON string for storage in the entity
            entity.setReviewersJson(objectMapper.writeValueAsString(submissionDto.reviewers()));
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error processing reviewers data for persistence.", e);
        }
        entity.setComments(submissionDto.comments());

        // Save the entity to the database
        submissionRepository.save(entity);

        return manuscriptFilePathOrUrl; // Return the path where the file is stored
    }

    /**
     * Retrieves a manuscript submission by its ID.
     *
     * @param id The ID of the manuscript submission.
     * @return An Optional containing the ManuscriptSubmissionEntity if found, or empty otherwise.
     */
    @Override
    public Optional<ManuscriptSubmission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    /**
     * Retrieves all manuscript submissions.
     *
     * @return A list of all ManuscriptSubmissionEntity objects.
     */
    @Override
    public List<ManuscriptSubmission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    /**
     * Updates an existing manuscript submission.
     *
     * @param id The ID of the manuscript submission to update.
     * @param updatedSubmission The ManuscriptSubmissionEntity object with updated details.
     * @return The updated ManuscriptSubmissionEntity.
     * @throws IllegalArgumentException If the submission with the given ID is not found.
     */
    @Override
    public ManuscriptSubmission updateSubmission(Long id, ManuscriptSubmission updatedSubmission) {
        // Check if the submission exists before updating
        return submissionRepository.findById(id).map(existingSubmission -> {
            // Update fields from the provided updatedSubmission entity
            existingSubmission.setJournal(updatedSubmission.getJournal());
            existingSubmission.setArticleTitle(updatedSubmission.getArticleTitle());
            existingSubmission.setArticleCategory(updatedSubmission.getArticleCategory());
            existingSubmission.setAbstractContent(updatedSubmission.getAbstractContent());
            existingSubmission.setKeywords(updatedSubmission.getKeywords());
            existingSubmission.setCorrespondingAuthor(updatedSubmission.getCorrespondingAuthor());
            existingSubmission.setAuthorEmail(updatedSubmission.getAuthorEmail());
            existingSubmission.setInstitution(updatedSubmission.getInstitution());
            // Note: File path and file name are typically not updated via this method;
            // a separate file upload/replacement mechanism would be needed.
            // For simplicity, we'll just update the metadata.
            existingSubmission.setReviewersJson(updatedSubmission.getReviewersJson());
            existingSubmission.setComments(updatedSubmission.getComments());

            return submissionRepository.save(existingSubmission); // Save the updated entity
        }).orElseThrow(() -> new IllegalArgumentException("Manuscript submission with ID " + id + " not found for update."));
    }

    /**
     * Deletes a manuscript submission by its ID.
     *
     * @param id The ID of the manuscript submission to delete.
     * @throws IllegalArgumentException If the submission with the given ID is not found.
     */
    @Override
    public void deleteSubmission(Long id) {
        if (!submissionRepository.existsById(id)) {
            throw new IllegalArgumentException("Manuscript submission with ID " + id + " not found for deletion.");
        }
        submissionRepository.deleteById(id);
    }
}
