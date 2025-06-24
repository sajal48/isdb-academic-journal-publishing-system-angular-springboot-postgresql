// src/main/java/com/himusharier/ajps_backend/dto/response/submission/SubmissionReviewerResponse.java
package com.himusharier.ajps_backend.dto.response.submission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionReviewerResponse {
    private Long id;
    private String name;
    private String email;
    private String institution;
    // Add any other fields from SubmissionReviewer if needed
}