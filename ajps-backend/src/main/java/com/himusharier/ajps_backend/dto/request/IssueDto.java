// src/main/java/com/himusharier/ajps_backend/dto/request/IssueDto.java
package com.himusharier.ajps_backend.dto.request;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueDto {
    private Long id;
    private Integer number;
    private Integer volume;
    private String status;
    private LocalDate publicationDate;
    // Add any other fields from the Issue model you want to expose in your API
    // For example:
    // private String issueCoverImageUrl;
}