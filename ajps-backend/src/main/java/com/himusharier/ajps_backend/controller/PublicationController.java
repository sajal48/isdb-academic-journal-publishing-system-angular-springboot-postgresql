package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.response.SuccessResponseModelPublication;
import com.himusharier.ajps_backend.service.PublicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publication") // Dedicated path for publication actions
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Consider restricting origins in a production environment
public class PublicationController {

    private final PublicationService publicationService;

    @PostMapping("/publish-article/{submissionId}/{issueId}/{fileId}")
    public ResponseEntity<SuccessResponseModelPublication<Long>> publishArticle(
            @PathVariable Long submissionId,
            @PathVariable Long issueId,
            @PathVariable Long fileId) {
        try {
            SuccessResponseModelPublication<Long> response = publicationService.publishManuscript(submissionId, issueId, fileId);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new SuccessResponseModelPublication<>(HttpStatus.BAD_REQUEST.value(), "error", e.getMessage(), null), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new SuccessResponseModelPublication<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "error", "An unexpected error occurred: " + e.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Handles the unpublication of an article by deleting its associated Paper record.
     * Also implicitly handles associated FileUpload record if CascadeType.ALL is configured.
     *
     * @param submissionId The ID of the submission to unpublish.
     * @return ResponseEntity with success or error message.
     */
    @DeleteMapping("/unpublish-article/{submissionId}")
    public ResponseEntity<SuccessResponseModelPublication<Void>> unpublishArticle(
            @PathVariable Long submissionId) {
        try {
            SuccessResponseModelPublication<Void> response = publicationService.unpublishManuscript(submissionId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Specific error for not found paper or submission
            return new ResponseEntity<>(new SuccessResponseModelPublication<>(HttpStatus.BAD_REQUEST.value(), "error", e.getMessage(), null), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // General server error
            return new ResponseEntity<>(new SuccessResponseModelPublication<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "error", "An unexpected error occurred: " + e.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}