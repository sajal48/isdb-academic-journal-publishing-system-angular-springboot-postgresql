package com.himusharier.ajps_backend.dto.request;

import com.himusharier.ajps_backend.constants.DiscussionOrigin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiscussionRequest {
    private String title;
    private String content;
    private DiscussionOrigin origin; // Changed to enum type
}