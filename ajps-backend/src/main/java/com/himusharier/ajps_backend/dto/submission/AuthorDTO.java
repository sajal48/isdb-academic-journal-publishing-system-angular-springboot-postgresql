package com.himusharier.ajps_backend.dto.submission;

public record AuthorDTO(
        String name,
        String email,
        String institution,
        boolean corresponding
) {
}
