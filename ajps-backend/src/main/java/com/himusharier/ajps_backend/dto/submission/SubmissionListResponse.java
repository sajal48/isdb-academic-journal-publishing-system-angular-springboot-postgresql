package com.himusharier.ajps_backend.dto.submission;

import com.himusharier.ajps_backend.constants.SubmissionStatus;
import java.time.LocalDateTime;

public record SubmissionListResponse(
        Long id,
        String journalName,
        String manuscriptTitle,
        String manuscriptCategory,
        SubmissionStatus submissionStatus,
        LocalDateTime submittedAt,
        LocalDateTime updatedAt

) {}
