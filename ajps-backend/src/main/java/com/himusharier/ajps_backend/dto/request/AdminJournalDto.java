package com.himusharier.ajps_backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminJournalDto {

    private Long id;
    private String journalName;
    private String issn;
    private String frequency;
    private String journalType;
    private String journalCode;
    private String contactEmail;
    private String journalUrl;
    private String aimsScopes;
    private String aboutJournal;
}
