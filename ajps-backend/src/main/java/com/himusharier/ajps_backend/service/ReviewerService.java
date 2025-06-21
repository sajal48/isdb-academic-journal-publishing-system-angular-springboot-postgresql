package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.dto.request.JournalShortDTO;
import com.himusharier.ajps_backend.dto.request.ReviewerDTO;
import com.himusharier.ajps_backend.model.*;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.JournalRepository;
import com.himusharier.ajps_backend.repository.ProfileRepository;
import com.himusharier.ajps_backend.repository.ReviewerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewerService {

    private final ReviewerRepository reviewerRepository;
    private final AuthRepository authRepository;
    private final ProfileRepository profileRepository;
    private final JournalRepository journalRepository;

    public List<ReviewerDTO> getAllReviewers() {
        List<Auth> reviewerAuths = authRepository.findByUserRole(UserRole.REVIEWER);

        return reviewerAuths.stream()
                .filter(auth -> auth.getProfile() != null)
                .map(auth -> {
                    Profile profile = auth.getProfile();

                    List<JournalShortDTO> journalDTOs = profile.getAssignedJournals().stream()
                            .map(j -> new JournalShortDTO(j.getId(), j.getJournalName()))
                            .toList();

                    return ReviewerDTO.builder()
                            .authId(auth.getId())
                            .profileId(profile.getId())
                            .firstName(profile.getFirstName())
                            .lastName(profile.getLastName())
                            .email(auth.getEmail())
                            .assignedJournals(journalDTOs)
                            .build();
                })
                .toList();
    }


    public void assignJournalsToReviewer(Long profileId, List<Long> journalIds) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        List<Journal> selectedJournals = journalRepository.findAllById(journalIds);
        profile.setAssignedJournals(selectedJournals);

        profileRepository.save(profile);
    }

}
