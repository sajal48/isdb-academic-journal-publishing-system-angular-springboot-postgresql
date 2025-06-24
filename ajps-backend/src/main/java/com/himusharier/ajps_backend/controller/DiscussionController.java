package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.CreateDiscussionRequest;
import com.himusharier.ajps_backend.dto.response.DiscussionResponse;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.service.DiscussionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/discussion")
//@CrossOrigin(origins = "http://localhost:4200") // Adjust for your frontend URL
public class DiscussionController {

    private final DiscussionService discussionService;

    public DiscussionController(DiscussionService discussionService) {
        this.discussionService = discussionService;
    }

    // Endpoint to create a new discussion for a submission
    // Example: POST /api/user/discussion/123?userId=1 (with CreateDiscussionRequest in body)
    @PostMapping("/{submissionId}")
    public ResponseEntity<?> createDiscussion(
            @PathVariable Long submissionId,
            @RequestParam Long userId, // Get userId from authenticated context in a real app
            @RequestBody CreateDiscussionRequest request
    ) {
        try {
            DiscussionResponse response = discussionService.createDiscussion(submissionId, userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("code", 201, "status", "success", "data", response));
        } catch (SubmissionRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("code", 404, "status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("code", 500, "status", "error", "message", "Failed to create discussion: " + e.getMessage()));
        }
    }

    // Endpoint to get all discussions for a specific submission
    // Example: GET /api/user/discussion/submission/123
    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<?> getDiscussionsForSubmission(@PathVariable Long submissionId) {
        try {
            List<DiscussionResponse> discussions = discussionService.getDiscussionsForSubmission(submissionId);
            return ResponseEntity.ok(Map.of("code", 200, "status", "success", "data", discussions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("code", 500, "status", "error", "message", "Failed to retrieve discussions: " + e.getMessage()));
        }
    }
}