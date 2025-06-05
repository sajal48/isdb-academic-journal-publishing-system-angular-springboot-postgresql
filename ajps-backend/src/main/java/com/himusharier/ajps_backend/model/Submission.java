package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.himusharier.ajps_backend.constants.SubmissionStatus;
import com.himusharier.ajps_backend.util.BdtZoneTimeUtil;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
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

    @Column(nullable = false)
    private String journalName;

    @Column(nullable = false)
    private String manuscriptTitle;

    @Column(nullable = false)
    private String manuscriptCategory;

    @Column(nullable = false)
    private String abstractContent;

    @Column(nullable = false)
    private String manuscriptKeywords;

    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus submissionStatus;

    private LocalDateTime createdAt;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    private boolean isPaymentDue;
    private String completedSteps;
    private boolean isEditable;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Author> authors;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FileUpload> files;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reviewer> reviewers;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonBackReference
    private Profile profile;

    @PrePersist
    protected void onCreate() {
        createdAt = BdtZoneTimeUtil.timeInBDT();
//        updatedAt = TimeUtil.timeInBDT();
        submissionNumber = generateRandomSubmissionNumber();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = BdtZoneTimeUtil.timeInBDT();
    }

    public void setSubmissionDateTime() {
        this.submittedAt = BdtZoneTimeUtil.timeInBDT();
    }

    private Long generateRandomSubmissionNumber() {
        return 100000L + new Random().nextInt(900000); // 6-digit number
    }
}
