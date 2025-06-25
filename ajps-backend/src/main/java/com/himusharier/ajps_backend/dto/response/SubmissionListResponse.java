package com.himusharier.ajps_backend.dto.response;

import com.himusharier.ajps_backend.constants.SubmissionStatus;
import java.time.LocalDateTime;

public record SubmissionListResponse(
        Long id,
        String journalName,
        Long submissionNumber,
        String manuscriptTitle,
        String manuscriptCategory,
        SubmissionStatus submissionStatus,
        LocalDateTime submittedAt,
        LocalDateTime updatedAt,
        boolean paymentDue,
        boolean editable,
        Long userId
) {}
