package com.himusharier.ajps_backend.dto.submission;

public record SubmitManuscriptRequest(
        Long submissionId,
        String submissionStatus
) {}