package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.submission.ManuscriptDetailsRequest;
import com.himusharier.ajps_backend.dto.submission.SubmissionListResponse;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.model.Submission;
import com.himusharier.ajps_backend.service.ProfileService;
import com.himusharier.ajps_backend.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/submission")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final ProfileService profileService;

    public SubmissionController(SubmissionService submissionService, ProfileService profileService) {
        this.submissionService = submissionService;
        this.profileService = profileService;
    }

    @GetMapping("/submission-list/{userId}")
    public ResponseEntity<?> submissionList(@PathVariable Long userId) {
        Profile profile = profileService.userProfileDetailsByUserId(userId);

        List<SubmissionListResponse> submissionList = profile.getSubmissionList().stream()
                .map(submission -> SubmissionListResponse.builder()
                        .id(submission.getId())
                        .journalName(submission.getJournalName())
                        .manuscriptTitle(submission.getManuscriptTitle())
                        .manuscriptCategory(submission.getManuscriptCategory())
                        .submissionStatus(submission.getSubmissionStatus())
                        .submittedAt(submission.getSubmittedAt())
                        .updatedAt(submission.getUpdatedAt())
                        .build()
                )
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("data", submissionList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /*@GetMapping("/completed-steps/{submissionId}")
    public ResponseEntity<Map<String, Object>> completedSteps(@PathVariable Long submissionId) {
        Submission submission = submissionService.findSubmisssionBySubmissionId(submissionId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("data", submission.getCompletedSteps());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }*/

    @GetMapping("/submission-details/{userId}/{submissionId}")
    public ResponseEntity<Map<String, Object>> submissionDetailsBySubmissionId(@PathVariable Long userId, @PathVariable Long submissionId) {
        Profile profile = profileService.userProfileDetailsByUserId(userId);

        try {
            Submission submissionDetails = submissionService.returnSubmissionDetails(profile, submissionId);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("data", submissionDetails);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            throw new SubmissionRequestException("Unable to process the request.");
        }
    }

    @PostMapping("/submit/manuscript-details")
    public ResponseEntity<Map<String, Object>> manuscriptDetails(@RequestBody ManuscriptDetailsRequest request) {
        Profile profile = profileService.userProfileDetailsByUserId(request.userId());

        try {
            Long submissionId = submissionService.saveManuscriptDetails(request, profile);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.CREATED.value());
            response.put("message", "Manuscript details saved successfully.");
            response.put("submissionId", submissionId);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            throw new SubmissionRequestException("Unable to process the request.");
        }
    }

    @PutMapping("/update/manuscript-details")
    public ResponseEntity<Map<String, Object>> updateManuscriptDetails(@RequestBody ManuscriptDetailsRequest request) {
        try {
            Submission ManuscriptDetails = submissionService.updateManuscriptDetails(request);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("message", "Manuscript details saved successfully.");
            response.put("submissionId", ManuscriptDetails.getId());

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            throw new SubmissionRequestException("Failed to update manuscript details.");
        }
    }


}
