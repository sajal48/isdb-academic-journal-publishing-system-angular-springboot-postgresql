package com.himusharier.ajps_backend.service; // Adjust package as per your project structure

import com.himusharier.ajps_backend.dto.ManuscriptSubmissionDTO; // Import the DTO record
import com.himusharier.ajps_backend.model.ManuscriptSubmission; // Alias for the entity class
import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Interface for the Manuscript Submission Service.
 * Defines the contract for handling manuscript submission business logic,
 * including initial submission, retrieval, update, and deletion.
 */
public interface ManuscriptSubmissionService {

    /**
     * Processes a new manuscript submission, including Base64 decoding, file storage,
     * and database persistence.
     *
     * @param submissionDto The DTO containing manuscript details, including the Base64 file content.
     * @return The path or URL where the manuscript file was stored.
     * @throws IOException If there's an error decoding Base64 or storing the file.
     * @throws IllegalArgumentException If there's a validation error or issue with data.
     */
    String processManuscriptSubmission(ManuscriptSubmissionDTO submissionDto) throws IOException;

    /**
     * Retrieves a manuscript submission by its ID.
     *
     * @param id The ID of the manuscript submission.
     * @return An Optional containing the ManuscriptSubmissionEntity if found, or empty otherwise.
     */
    Optional<ManuscriptSubmission> getSubmissionById(Long id);

    /**
     * Retrieves all manuscript submissions.
     *
     * @return A list of all ManuscriptSubmissionEntity objects.
     */
    List<ManuscriptSubmission> getAllSubmissions();

    /**
     * Updates an existing manuscript submission.
     *
     * @param id The ID of the manuscript submission to update.
     * @param updatedSubmission The ManuscriptSubmissionEntity object with updated details.
     * @return The updated ManuscriptSubmissionEntity.
     * @throws IllegalArgumentException If the submission with the given ID is not found.
     */
    ManuscriptSubmission updateSubmission(Long id, ManuscriptSubmission updatedSubmission);

    /**
     * Deletes a manuscript submission by its ID.
     *
     * @param id The ID of the manuscript submission to delete.
     * @throws IllegalArgumentException If the submission with the given ID is not found.
     */
    void deleteSubmission(Long id);
}
