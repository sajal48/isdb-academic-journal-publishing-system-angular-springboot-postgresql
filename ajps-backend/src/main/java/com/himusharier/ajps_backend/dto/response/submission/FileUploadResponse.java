// src/main/java/com/himusharier/ajps_backend/dto/response/submission/FileUploadResponse.java
package com.himusharier.ajps_backend.dto.response.submission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileUploadResponse {
    private Long id;
    private String fileOrigin;
    private String storedName;
    private String originalName;
    private long size;
    private String type;
    private String fileUrl;
    private boolean isReviewFile;
}