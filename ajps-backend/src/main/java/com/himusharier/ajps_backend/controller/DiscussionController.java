package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.CreateDiscussionRequest;
import com.himusharier.ajps_backend.dto.response.DiscussionResponse;
import com.himusharier.ajps_backend.dto.response.SuccessResponseModel;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.model.Discussion;
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
    @PostMapping("/{submissionId}/discussions/create/{creatorId}") // Exact mapping for your endpoint
    public ResponseEntity<SuccessResponseModel<DiscussionResponse>> createDiscussion(
            @PathVariable Long submissionId,
            @PathVariable Long creatorId,
            @RequestBody CreateDiscussionRequest request) {

        // Ensure discussionService is actually submissionService here
        Discussion discussion = discussionService.createDiscussion( // Corrected service call
                submissionId,
                creatorId,
                request.getTitle(),
                request.getContent(),
                request.getOrigin()
        );

        DiscussionResponse discussionResponse = DiscussionResponse.builder()
                .id(discussion.getId())
                .submissionId(discussion.getSubmission().getId())
                .creatorId(discussion.getCreator().getUserId())
                .creatorName(discussion.getCreator().getUserRole().toString()) // Ensure getUserRole().toString() is valid
                .title(discussion.getTitle())
                .content(discussion.getContent())
                .origin(discussion.getOrigin())
                .createdAt(discussion.getCreatedAt())
                .build();

        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.CREATED.value(),
                        discussionResponse,
                        "Discussion created successfully."),
                HttpStatus.CREATED);
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