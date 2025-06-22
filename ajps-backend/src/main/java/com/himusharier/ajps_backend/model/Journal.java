package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ajps_journals")
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

    @OneToMany(mappedBy = "journal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EditorAssignment> editorAssignments = new ArrayList<>();
}
