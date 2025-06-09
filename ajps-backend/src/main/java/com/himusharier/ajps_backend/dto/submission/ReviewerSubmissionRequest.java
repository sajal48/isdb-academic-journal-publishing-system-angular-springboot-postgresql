package com.himusharier.ajps_backend.dto.submission;

import java.util.List;

public record ReviewerSubmissionRequest (
        Long submissionId,
        List<ReviewerDTO> reviewers
) {
}
