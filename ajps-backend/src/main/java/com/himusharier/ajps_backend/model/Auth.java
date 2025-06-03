package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.himusharier.ajps_backend.constants.UserStatus;
import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.util.BdtZoneTimeUtil;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Random;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "AJPS_AUTH")
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(updatable = false, nullable = false, unique = true)
    private Long userId;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole userRole;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long otp;
    private boolean isOtpUsed;
    private LocalDateTime otpExpireTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus userStatus;

    @OneToOne(mappedBy = "auth", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Profile profile;


    @PrePersist
    protected void onCreate() {
        createdAt = BdtZoneTimeUtil.timeInBDT();
        updatedAt = BdtZoneTimeUtil.timeInBDT();
        userId = generateRandomUserId();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = BdtZoneTimeUtil.timeInBDT();
    }

    public void generateNewOtp() {
        this.otp = generateRandomOtp();
        this.otpExpireTime = BdtZoneTimeUtil.timeInBDT().plusMinutes(10); // otp valid for 10 minutes
        this.isOtpUsed = false;
    }

    private Long generateRandomUserId() {
        return 10_000_000L + new Random().nextLong(90_000_000L); // 8-digit number
    }

    private Long generateRandomOtp() {
        return 100000L + new Random().nextInt(900000); // 6-digit number
    }
}