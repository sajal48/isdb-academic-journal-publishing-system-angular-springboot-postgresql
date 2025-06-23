package com.himusharier.ajps_backend.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditorDTO {
    private Long profileId;
    private Long authId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private List<JournalShortDTO> assignedJournals;

    // For assigning journals
    private List<Long> assignedJournalsIds;
}
