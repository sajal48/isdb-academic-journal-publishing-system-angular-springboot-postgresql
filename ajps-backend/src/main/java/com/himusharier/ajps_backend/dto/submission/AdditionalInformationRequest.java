package com.himusharier.ajps_backend.dto.submission;

import java.util.List;

public record AdditionalInformationRequest(
        Long submissionId,
        String comments,
        boolean confirmed,
        List<String> completedSteps
) {}