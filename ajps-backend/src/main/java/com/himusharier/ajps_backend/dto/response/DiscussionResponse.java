package com.himusharier.ajps_backend.dto.response;

import com.himusharier.ajps_backend.constants.DiscussionOrigin;
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
    private String creatorName;
    private String title;
    private String content;
    private DiscussionOrigin origin; // Changed to enum type
    private LocalDateTime createdAt;
}