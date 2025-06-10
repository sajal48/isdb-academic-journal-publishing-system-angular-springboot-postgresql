package com.himusharier.ajps_backend.dto.submission;

import java.util.List;

public record SubmitManuscriptRequest(
        Long submissionId,
        String submissionStatus,
        List<String> completedSteps
) {}