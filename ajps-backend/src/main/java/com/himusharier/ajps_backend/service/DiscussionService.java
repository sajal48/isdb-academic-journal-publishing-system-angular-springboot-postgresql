package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.dto.request.CreateDiscussionRequest;
import com.himusharier.ajps_backend.dto.response.DiscussionResponse;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.exception.UserProfileException;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.Discussion;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.model.Submission;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.DiscussionRepository;
import com.himusharier.ajps_backend.repository.ProfileRepository;
import com.himusharier.ajps_backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final SubmissionRepository submissionRepository;
    private final AuthRepository authRepository;
    private final ProfileService profileService;

    public DiscussionService(DiscussionRepository discussionRepository,
                             SubmissionRepository submissionRepository,
                             AuthRepository authRepository,
                             ProfileService profileService) {
        this.discussionRepository = discussionRepository;
        this.submissionRepository = submissionRepository;
        this.authRepository = authRepository;
        this.profileService = profileService;
    }

    @Transactional
    public DiscussionResponse createDiscussion(Long submissionId, Long userId, CreateDiscussionRequest request) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new SubmissionRequestException("Submission not found with ID: " + submissionId));

        Auth profile = profileService.userProfileDetailsByUserId(userId).getAuth();

        Auth creator = authRepository.findById(profile.getId())
                .orElseThrow(() -> new UserProfileException("User not found with ID: " + userId));

        Discussion discussion = Discussion.builder()
                .submission(submission)
                .creator(creator)
                .title(request.getTitle())
                .content(request.getContent()) // Use 'content' from the request
                .build();
        discussion = discussionRepository.save(discussion);

        return mapToDiscussionResponse(discussion);
    }

    @Transactional(readOnly = true)
    public List<DiscussionResponse> getDiscussionsForSubmission(Long submissionId) {
        List<Discussion> discussions = discussionRepository.findBySubmissionId(submissionId);
        return discussions.stream()
                .map(this::mapToDiscussionResponse)
                .collect(Collectors.toList());
    }

    // Helper method to map entity to DTO
    private DiscussionResponse mapToDiscussionResponse(Discussion discussion) {
        return DiscussionResponse.builder()
                .id(discussion.getId())
                .submissionId(discussion.getSubmission().getId())
                .creatorId(discussion.getCreator().getId())
                .creatorName(discussion.getCreator().getUserRole().toString()) // Assuming User.getName() exists
                .title(discussion.getTitle())
                .content(discussion.getContent())
                .createdAt(discussion.getCreatedAt())
                .build();
    }
}