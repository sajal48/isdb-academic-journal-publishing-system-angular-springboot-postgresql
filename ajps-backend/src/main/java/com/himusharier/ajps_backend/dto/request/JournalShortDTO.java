package com.himusharier.ajps_backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalShortDTO {
    private Long id;
    private String title;
}
