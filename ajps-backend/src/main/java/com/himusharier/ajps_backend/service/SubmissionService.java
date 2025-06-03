package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.SubmissionStatus;
import com.himusharier.ajps_backend.dto.submission.ManuscriptDetailsRequest;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.model.Submission;
import com.himusharier.ajps_backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    public Submission returnSubmissionDetails(Profile profile, Long submissionId) {
        Optional<Submission> optionalSubmission = submissionRepository.findByIdAndProfile(submissionId, profile);

        if (optionalSubmission.isPresent()) {
            return optionalSubmission.get();

        } else {
            throw new SubmissionRequestException("Submission not found for given user and submission ID.");
        }
    }

    @Transactional
    public Long saveManuscriptDetails(ManuscriptDetailsRequest request, Profile profile) {
        Submission manuscriptDetails = Submission.builder()
                .journalName(request.journalName())
                .manuscriptTitle(request.manuscriptTitle())
                .manuscriptCategory(request.manuscriptCategory())
                .abstractContent(request.abstractContent())
                .manuscriptKeywords(request.manuscriptKeywords())
                .completedSteps(request.completedSteps())
                .submissionStatus(SubmissionStatus.SAVED)
                .profile(profile)
                .build();

        Submission savedSubmission = submissionRepository.save(manuscriptDetails);
        return savedSubmission.getId();
    }

    public Submission updateManuscriptDetails(ManuscriptDetailsRequest updatedSubmission) {
        Long submissionId = updatedSubmission.submissionId();
        if (submissionId == null) {
            throw new IllegalArgumentException("Submission ID must not be null for update.");
        }

        Submission existingSubmission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + submissionId));

        // Update fields
        existingSubmission.setJournalName(updatedSubmission.journalName());
        existingSubmission.setManuscriptTitle(updatedSubmission.manuscriptTitle());
        existingSubmission.setManuscriptCategory(updatedSubmission.manuscriptCategory());
        existingSubmission.setAbstractContent(updatedSubmission.abstractContent());
        existingSubmission.setManuscriptKeywords(updatedSubmission.manuscriptKeywords());
        existingSubmission.setCompletedSteps(updatedSubmission.completedSteps());

//        Submission updateSubmission = submissionRepository.save(existingSubmission);
        return submissionRepository.save(existingSubmission);
    }


}
