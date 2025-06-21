package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "AJPS_JOURNALS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Journal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String journalName;

    @Column(nullable = false, unique = true)
    private String issn;

    @Column(nullable = false)
    private String frequency;

    @Column(nullable = false)
    private String journalType;

    @Column(nullable = false, unique = true)
    private String journalCode;

    @Column(nullable = false)
    private String contactEmail;

    @Column(nullable = false)
    private String journalUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String aimsScopes;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String aboutJournal;
}
