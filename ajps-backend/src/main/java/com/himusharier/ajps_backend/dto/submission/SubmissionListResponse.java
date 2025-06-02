package com.himusharier.ajps_backend.dto.submission;

import com.himusharier.ajps_backend.constants.SubmissionStatus;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record SubmissionListResponse(
        Long id,
        String journalName,
        String manuscriptTitle,
        String manuscriptCategory,
        SubmissionStatus submissionStatus,
        LocalDateTime submittedAt,
        LocalDateTime updatedAt

) {}
