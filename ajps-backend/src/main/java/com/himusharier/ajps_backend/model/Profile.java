package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
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

    private LocalDateTime updatedAt;


    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
