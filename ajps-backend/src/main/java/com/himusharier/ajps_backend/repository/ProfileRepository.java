package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByAuth_Id(Long authId);

}
