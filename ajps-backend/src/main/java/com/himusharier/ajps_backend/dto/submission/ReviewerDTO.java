package com.himusharier.ajps_backend.dto.submission;

public record ReviewerDTO(
        Long id,
        String name,
        String email,
        String institution
) {
}
