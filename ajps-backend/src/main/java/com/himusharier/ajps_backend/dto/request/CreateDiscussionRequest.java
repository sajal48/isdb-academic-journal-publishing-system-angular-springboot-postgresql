package com.himusharier.ajps_backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiscussionRequest {
    private String title;
    private String content; // Renamed from initialMessage
}