package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ajps_papers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    @JsonBackReference("issue-paper")
    private Issue issue;

    // Optional: If you want to keep a direct link to Submission:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
//    @JsonIgnoreProperties({"papers"})
//    @JsonBackReference
//    @JsonManagedReference
//    @JsonIgnoreProperties({"papers", "authors", "files", "submissionReviewers"})
    @JsonIgnoreProperties({"papers", "files", "submissionReviewers", "profile"})
    private Submission submission;

    // File upload details (assuming file upload belongs to paper)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "file_upload_id")
    private FileUpload fileUpload;
}
