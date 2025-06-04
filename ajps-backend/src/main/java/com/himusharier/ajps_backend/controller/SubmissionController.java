package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.response.SuccessResponseModel;
import com.himusharier.ajps_backend.dto.submission.AuthorInformationRequest;
import com.himusharier.ajps_backend.dto.submission.ManuscriptDetailsRequest;
import com.himusharier.ajps_backend.dto.submission.SubmissionListResponse;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.model.Author;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.model.Submission;
import com.himusharier.ajps_backend.service.AuthorService;
import com.himusharier.ajps_backend.service.ProfileService;
import com.himusharier.ajps_backend.service.SubmissionService;
import com.himusharier.ajps_backend.util.UserSubmissionListMapperUtil;
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
    private final AuthorService authorService;

    public SubmissionController(
            SubmissionService submissionService,
            ProfileService profileService,
            AuthorService authorService) {
        this.submissionService = submissionService;
        this.profileService = profileService;
        this.authorService = authorService;
    }

    /*@GetMapping("/submission-list/{userId}")
    public ResponseEntity<?> returnSubmissionList(@PathVariable Long userId) {
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
    }*/

    @GetMapping("/submission-list/{userId}")
    public ResponseEntity<?> returnSubmissionList(@PathVariable Long userId) {
        Profile profile = profileService.userProfileDetailsByUserId(userId);

        List<SubmissionListResponse> submissionList = profile.getSubmissionList().stream()
                .map(UserSubmissionListMapperUtil::submissionListResponseFromSubmission
                )
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("data", submissionList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

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
    public ResponseEntity<SuccessResponseModel<Map<String,Object>>> manuscriptDetails(@RequestBody ManuscriptDetailsRequest request) {
        Profile profile = profileService.userProfileDetailsByUserId(request.userId());

        try {
            Long submissionId = submissionService.saveManuscriptDetails(request, profile);

            /*Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.CREATED.value());
            response.put("message", "Manuscript details saved successfully.");
            response.put("submissionId", submissionId);
            return new ResponseEntity<>(response, HttpStatus.CREATED);*/

            return new ResponseEntity<>(
                    new SuccessResponseModel<>(
                            HttpStatus.CREATED.value(), Map.of("submissionId", submissionId), "Manuscript details saved successfully."),
                    HttpStatus.CREATED);

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

    /*@PostMapping("/submit/author-informations")
    public ResponseEntity<Map<String, Object>> saveAuthors(@RequestBody AuthorInformationRequest request) {
        Submission submission = submissionService.returnSubmission(request.submissionId());
        List<Author> savedAuthors = authorService.saveAuthors(request.authors(), submission);

        if (savedAuthors.isEmpty()) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.BAD_REQUEST.value());
            response.put("message", "Failed to save authors.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("message", "Authors saved successfully.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }*/

    @PostMapping("/submit/author-informations")
    public ResponseEntity<SuccessResponseModel<Map<String, Object>>> saveAuthors(@RequestBody AuthorInformationRequest request) {
        Submission submission = submissionService.returnSubmission(request.submissionId());
        List<Author> savedAuthors = authorService.saveAuthors(request.authors(), submission);

        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("authors", savedAuthors);

        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.OK.value(),
                        responseData,
                        "Authors saved successfully."),
                HttpStatus.OK);
    }

    @DeleteMapping("/remove-author/{submissionId}/{authorEmail}")
    public ResponseEntity<SuccessResponseModel<Void>> removeAuthor(
            @PathVariable Long submissionId,
            @PathVariable String authorEmail) {
        authorService.removeAuthor(submissionId, authorEmail);
        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.OK.value(),
                        null,
                        "Author removed successfully."),
                HttpStatus.OK);
    }

    @PutMapping("/update/completed-steps")
    public ResponseEntity<SuccessResponseModel<Map<String, Object>>> updateCompletedSteps(@RequestBody AuthorInformationRequest request) {
        submissionService.updateCompletedSteps(request.submissionId(), request.completedSteps());

        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.OK.value(),
                        "Author information saved successfully."),
                HttpStatus.OK);
    }



}
