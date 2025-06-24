// src/main/java/com/himusharier/ajps_backend/dto/response/submission/SubmissionDetailsResponse.java
package com.himusharier.ajps_backend.dto.response.submission;

import com.himusharier.ajps_backend.constants.SubmissionStatus;
import com.fasterxml.jackson.annotation.JsonFormat; // Import for date formatting
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SubmissionDetailsResponse {
    private Long id;
    private Long submissionNumber;
    private JournalResponse journal; // Nested Journal DTO
    private String manuscriptTitle;
    private String manuscriptCategory;
    private String abstractContent;
    private String manuscriptKeywords;
    private String comments;
    private boolean submissionConfirmation;
    private SubmissionStatus submissionStatus;

    // Use @JsonFormat for consistent date/time serialization with frontend
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS") // Matches your backend's default LocalDateTime format
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
    private LocalDateTime submittedAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
    private LocalDateTime updatedAt;

    private boolean isPaymentDue;
    private String completedSteps; // Or List<String> if you map it
    private boolean isEditable;
    private List<AuthorResponse> authors; // Nested Author DTO
    private List<FileUploadResponse> files; // Nested FileUpload DTO
    private List<SubmissionReviewerResponse> submissionReviewers; // Nested Reviewer DTO

    // Add other fields from your Manuscript interface that might not be directly in Submission,
    // or map them from comments/status if applicable (e.g., discussions, review status)
    // private List<DiscussionResponse> discussions; // If you add discussions to your backend
    // private ReviewStatusResponse review; // If you map this from submissionStatus
    // ...
}