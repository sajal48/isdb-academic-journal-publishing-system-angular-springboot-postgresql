// src/main/java/com/himusharier/ajps_backend/dto/response/submission/JournalResponse.java
package com.himusharier.ajps_backend.dto.response.submission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JournalResponse {
    private Long id;
    private String journalName;
    // Add other journal properties if needed
}