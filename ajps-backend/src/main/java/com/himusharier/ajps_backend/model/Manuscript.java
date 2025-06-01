package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable; // Recommended for JPA entities

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AJPS_MANUSCRIPT")
public class Manuscript implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key for the entity

    @Column(nullable = false)
    private String journalName;

    @Column(nullable = false)
    private String articleTitle;

    @Column(nullable = false)
    private String articleCategory;

    @Lob // Used for large text fields (e.g., CLOB in SQL)
    @Column(nullable = false)
    private String abstractContent;

    @Lob
    @Column(nullable = false)
    private String articleKeywords;

    @Lob
    @Column(name = "comments") // Comments field can be nullable as per frontend logic
    private String comments;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author articleAuthors; // authors

    @ManyToOne
    @JoinColumn(name = "file_id")
    private Files files; // files

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private Reviewer articleReviewers; // reviewers

}
