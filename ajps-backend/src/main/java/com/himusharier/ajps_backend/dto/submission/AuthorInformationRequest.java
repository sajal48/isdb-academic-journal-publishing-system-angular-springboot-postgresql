package com.himusharier.ajps_backend.dto.submission;

import java.util.List;

public record AuthorInformationRequest(
        Long submissionId,
        List<AuthorDTO> authors,
        List<String> completedSteps
) {
}
