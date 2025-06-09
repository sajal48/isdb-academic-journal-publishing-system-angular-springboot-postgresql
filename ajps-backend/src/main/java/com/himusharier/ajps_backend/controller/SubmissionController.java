package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.response.ApiResponse;
import com.himusharier.ajps_backend.dto.response.SuccessResponseModel;
import com.himusharier.ajps_backend.dto.submission.*;
import com.himusharier.ajps_backend.dto.response.SubmissionListResponse;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.model.Author;
import com.himusharier.ajps_backend.model.FileUpload;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.model.Submission;
import com.himusharier.ajps_backend.service.AuthorService;
import com.himusharier.ajps_backend.service.FileStorageService;
import com.himusharier.ajps_backend.service.ProfileService;
import com.himusharier.ajps_backend.service.SubmissionService;
import com.himusharier.ajps_backend.util.UserSubmissionListMapperUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
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

    @DeleteMapping("/remove-author/{submissionId}/{authorId}")
    public ResponseEntity<SuccessResponseModel<Void>> removeAuthor(
            @PathVariable Long submissionId,
            @PathVariable Long authorId) {
        authorService.removeAuthor(submissionId, authorId);
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



    @PostMapping("/manuscript/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("submissionId") Long submissionId
    ) {
        try {
            FileUpload savedFile = submissionService.saveFile(submissionId, file);
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", savedFile.getStoredName());
            data.put("originalName", savedFile.getOriginalName());
            data.put("size", savedFile.getSize());
            return ResponseEntity.ok(Map.of("code", 200, "data", data));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("code", 500, "message", "File upload failed"));
        }
    }

    @DeleteMapping("/manuscript/remove/{submissionId}/{fileId}")
    public ResponseEntity<?> deleteFile(
            @PathVariable("submissionId") Long submissionId,
            @PathVariable("fileId") Long fileId
    ) {
        try {
            submissionService.deleteFile(submissionId, fileId);
            return ResponseEntity.ok(Map.of("code", 200, "message", "File deleted"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("code", 500, "message", "Delete failed"));
        }
    }






    @PostMapping("/submit/reviewer-informations")
    public ApiResponse<?> saveReviewerInformations(@RequestBody ReviewerSubmissionRequest request) {
        submissionService.saveReviewers(request);
        return new ApiResponse<>(200, "Reviewers saved successfully");
    }

    @DeleteMapping("/remove-reviewer/{submissionId}/{reviewerId}")
    public ApiResponse<?> deleteReviewer(@PathVariable Long submissionId, @PathVariable Long reviewerId) {
        submissionService.removeReviewer(submissionId, reviewerId);
        return new ApiResponse<>(200, "Reviewer deleted successfully");
    }

    @GetMapping("/reviewers/{submissionId}")
    public ApiResponse<List<ReviewerDTO>> getReviewers(@PathVariable Long submissionId) {
        List<ReviewerDTO> reviewers = submissionService.getReviewersBySubmissionId(submissionId);
        return new ApiResponse<>(200, "Fetched successfully", reviewers);
    }







    @PostMapping("/submit/additional-informations")
    public ApiResponse<?> saveAdditionalInformation(@RequestBody AdditionalInformationRequest request) {
        Submission saved = submissionService.saveAdditionalInformation(request);
        return new ApiResponse<>(201, "Additional information saved successfully", Map.of("submissionId", saved.getId()));
    }




    @PutMapping("/submit-manuscript")
    public ApiResponse<?> submitManuscript(@RequestBody SubmitManuscriptRequest request) {
        Submission saved = submissionService.submitManuscript(request);
        return new ApiResponse<>(200, "Manuscript submitted successfully", Map.of("submissionId", saved.getId()));
    }



}
