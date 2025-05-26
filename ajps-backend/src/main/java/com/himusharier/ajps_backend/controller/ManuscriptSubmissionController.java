package com.himusharier.ajps_backend.controller; // Adjust package as per your project structure

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.himusharier.ajps_backend.dto.ManuscriptSubmissionDTO; // Import the DTO record
import com.himusharier.ajps_backend.service.ManuscriptSubmissionService; // Import the service
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; // Import @RequestBody
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException; // Ensure IOException is imported
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * REST Controller for handling manuscript submission requests.
 * It processes incoming JSON data, validates inputs,
 * and delegates the business logic to the ManuscriptSubmissionService.
 */
@RestController
@RequestMapping("/api/submission") // Base path for submission-related endpoints
public class ManuscriptSubmissionController {

    private final ManuscriptSubmissionService manuscriptSubmissionService;
    private final ObjectMapper objectMapper; // ObjectMapper is still useful for general JSON operations

    /**
     * Constructor for dependency injection.
     * @param manuscriptSubmissionService The service to handle manuscript submission logic.
     * @param objectMapper ObjectMapper for JSON serialization/deserialization.
     */
    public ManuscriptSubmissionController(ManuscriptSubmissionService manuscriptSubmissionService, ObjectMapper objectMapper) {
        this.manuscriptSubmissionService = manuscriptSubmissionService;
        this.objectMapper = objectMapper;
    }

    /**
     * Handles POST requests for new manuscript submissions.
     * Expects a JSON payload representing the ManuscriptSubmissionDTO,
     * where the manuscriptFile field contains the Base64 encoded file content.
     *
     * @param submissionDto The ManuscriptSubmissionDTO object received as a JSON request body.
     * It contains all manuscript details, including the Base64 encoded file string
     * and the list of reviewers.
     * @return ResponseEntity indicating the success or failure of the submission.
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitManuscript(
            @RequestBody ManuscriptSubmissionDTO submissionDto // Now accepts the entire DTO as JSON body
    ) {
        try {
            // No need to manually parse reviewersJson or extract file from MultipartFile here.
            // Spring's @RequestBody automatically deserializes the JSON into ManuscriptSubmissionDTO,
            // including the List<ReviewerDTO> and the Base64 manuscriptFile string.

            // Basic validation: Check if the Base64 file content is present
            if (submissionDto.manuscriptFile() == null || submissionDto.manuscriptFile().trim().isEmpty()) {
                return new ResponseEntity<>("Manuscript file content (Base64) is missing.", HttpStatus.BAD_REQUEST);
            }
            // Basic validation: Check if the original file name is present
            if (submissionDto.fileName() == null || submissionDto.fileName().trim().isEmpty()) {
                return new ResponseEntity<>("Manuscript original file name is missing.", HttpStatus.BAD_REQUEST);
            }

            // Delegate to the service layer for business logic (Base64 decoding, file storage, database persistence)
            // The service will now handle the Base64 decoding of the manuscriptFile string.
            String filePathOrUrl = manuscriptSubmissionService.processManuscriptSubmission(submissionDto);

            // Changed the success message to be more generic as requested
//            return new ResponseEntity<>("Manuscript submitted successfully!", HttpStatus.OK);
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("message", "Manuscript submitted successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            // Handle validation errors from the DTO or service
            return new ResponseEntity<>("Validation Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (IOException e) { // Re-added the IOException catch block
            // Handle file processing errors (e.g., decoding Base64, saving file)
            return new ResponseEntity<>("Error processing manuscript file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Catch any other unexpected errors
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
