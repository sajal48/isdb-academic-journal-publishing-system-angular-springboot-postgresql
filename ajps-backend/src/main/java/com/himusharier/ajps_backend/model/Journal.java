package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Column(nullable = false, unique = true)
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

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @OneToMany(mappedBy = "journal", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<EditorAssignment> editorAssignments = new ArrayList<>();

    // NEW: One-to-Many relationship with Issue
    @OneToMany(mappedBy = "journal", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("journal-issue")
    private List<Issue> issues = new ArrayList<>();
}