package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.himusharier.ajps_backend.util.BdtZoneTimeUtil;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AJPS_PROFILE")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "auth_id", referencedColumnName = "id", unique = true)
    @JsonIgnore
    private Auth auth;

//    private String email;
    private String nameTitle;
    private String firstName;
    private String middleName;
    private String lastName;
    private String professionalTitle;
    private String educationalQualification;
    private String institute;

    private String expertise;

    private String mobile;
    private String telephone;
    private String country;

    private String address;

    private String zipCode;
    private String facebookUrl;
    private String twitterUrl;

    private String profileImage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Submission> submissionList;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "profile_journals",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "journal_id")
    )
    private List<Journal> assignedJournals = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EditorAssignment> editorAssignments;

    @PrePersist
    protected void onCreate() {
        createdAt = BdtZoneTimeUtil.timeInBDT();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = BdtZoneTimeUtil.timeInBDT();
    }

}
