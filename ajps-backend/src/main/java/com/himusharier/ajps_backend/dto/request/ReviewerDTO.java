package com.himusharier.ajps_backend.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewerDTO {
    private Long profileId;
    private Long authId;
    private String firstName;
    private String lastName;
    private String email;
    private List<JournalShortDTO> assignedJournals;
}
