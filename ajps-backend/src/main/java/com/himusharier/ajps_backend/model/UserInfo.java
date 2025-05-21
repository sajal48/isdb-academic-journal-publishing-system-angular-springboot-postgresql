package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AJPS_USER_INFO")
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true)
    private Auth auth;

    private String nameTitle;
    private String firstName;
    private String middleName;
    private String lastName;
    private String professionalTitle;
    private String educationalQualification;
    private String institute;
    private String expertise;
    //private String email;
    private String mobile;
    private String telephone;
    private String country;
    private String address;
    private String zipCode;
    private String facebookUrl;
    private String twitterUrl;

    private LocalDateTime updateAt;

}
