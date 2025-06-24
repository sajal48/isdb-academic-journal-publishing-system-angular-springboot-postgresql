// src/main/java/com/himusharier/ajps_backend/dto/response/submission/AuthorResponse.java
package com.himusharier.ajps_backend.dto.response.submission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorResponse {
    private Long id; // Assuming Author model has an ID
    private String name;
    private String email;
    private String institution;
    private boolean corresponding;
}