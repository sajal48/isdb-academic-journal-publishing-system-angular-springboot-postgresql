package com.himusharier.ajps_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscussionResponse {
    private Long id;
    private Long submissionId;
    private Long creatorId;
    private String creatorName; // Display name of the creator
    private String title;
    private String content; // The single message content
    private LocalDateTime createdAt;
}