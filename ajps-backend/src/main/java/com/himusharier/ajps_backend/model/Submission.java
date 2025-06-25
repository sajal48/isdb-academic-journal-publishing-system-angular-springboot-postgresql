package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.himusharier.ajps_backend.constants.SubmissionStatus;
import com.himusharier.ajps_backend.util.BdtZoneTimeUtil;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AJPS_SUBMISSION")
public class Submission implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(updatable = false, nullable = false, unique = true)
    private Long submissionNumber;

    @ManyToOne
    @JoinColumn(name = "journal_id", nullable = false) // Foreign key column
    private Journal journal; // Link to the Journal entity

    @Column(nullable = false)
    private String manuscriptTitle;

    @Column(nullable = false)
    private String manuscriptCategory;

    @Column(nullable = false)
    private String abstractContent;

    @Column(nullable = false)
    private String manuscriptKeywords;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(nullable = false)
    private boolean submissionConfirmation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus submissionStatus;

    private LocalDateTime createdAt;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    private boolean isPaymentDue;
    private String completedSteps;
    private boolean isEditable;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<Author> authors = new ArrayList<>(); // Initialize to prevent NullPointerException

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<FileUpload> files = new ArrayList<>(); // Initialize to prevent NullPointerException

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<SubmissionReviewer> submissionReviewers = new ArrayList<>(); // Initialize to prevent NullPointerException

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonBackReference
    private Profile profile;

    // --- New Fields for File Tracking within Submission (optional, but aligns with service logic) ---
    // These could also be managed purely through the FileUpload entity,
    // but having flags here can make queries/logic on Submission itself easier.
    // However, your FileUpload model already has these, so usually,
    // you'd rely on the FileUpload entity's flags.
    // If you add them here, ensure they are kept in sync with FileUpload entities.
    // For now, I'm NOT adding them directly to Submission, as FileUpload already has them.


    @PrePersist
    protected void onCreate() {
        createdAt = BdtZoneTimeUtil.timeInBDT();
        // Generate submission number only if not already set (e.g., if set manually in test)
        if (submissionNumber == null || submissionNumber == 0L) {
            submissionNumber = generateRandomSubmissionNumber();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = BdtZoneTimeUtil.timeInBDT();
    }

    public void setSubmissionDateTime() {
        this.submittedAt = BdtZoneTimeUtil.timeInBDT();
    }

    private Long generateRandomSubmissionNumber() {
        // Generates a 6-digit number, ensuring it's unique if necessary in a larger system
        // For simplicity, a random number is generated. In production, you might need a more robust sequence generator.
        return 100000L + new Random().nextInt(900000);
    }

    // --- Transient Getter for userId ---
    // This method will NOT be persisted to the database.
    // It provides convenient access to the userId associated with the submission's owner.
    @Transient
    @JsonIgnore // Prevents this from being serialized if you use Lombok's @Data or @ToString which might include it
    public Long getUserId() {
        if (this.profile != null && this.profile.getAuth() != null) {
            return this.profile.getAuth().getUserId();
        }
        return null;
    }
}