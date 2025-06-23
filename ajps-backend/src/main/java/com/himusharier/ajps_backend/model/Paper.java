package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    // Paper metadata comes from Submission, but we duplicate some here for convenience
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String authors;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    @JsonBackReference
    private Issue issue;

    // Optional: If you want to keep a direct link to Submission:
    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "submission_id")
    //@JsonIgnoreProperties({"papers"})
    //private Submission submission;

    // File upload details (assuming file upload belongs to paper)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "file_upload_id")
    private FileUpload fileUpload;
}
