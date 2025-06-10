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
import com.himusharier.ajps_backend.service.ProfileService;
import com.himusharier.ajps_backend.service.SubmissionService;
import com.himusharier.ajps_backend.util.UserSubmissionListMapperUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/submission")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final ProfileService profileService;

    public SubmissionController(
            SubmissionService submissionService,
            ProfileService profileService
    ) {
        this.submissionService = submissionService;
        this.profileService = profileService;
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<?> returnSubmissionList(@PathVariable Long userId) {
        Profile profile = profileService.userProfileDetailsByUserId(userId);

        List<SubmissionListResponse> submissionList = profile.getSubmissionList().stream()
                .map(UserSubmissionListMapperUtil::submissionListResponseFromSubmission
                )
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("code", HttpStatus.OK.value());
        response.put("data", submissionList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/details/{userId}/{submissionId}")
    public ResponseEntity<Map<String, Object>> submissionDetailsBySubmissionId(@PathVariable Long userId, @PathVariable Long submissionId) {
        Profile profile = profileService.userProfileDetailsByUserId(userId);

        try {
            Submission submissionDetails = submissionService.returnSubmissionDetails(profile, submissionId);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("data", submissionDetails);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            throw new SubmissionRequestException("Unable to process the request.");
        }
    }

    @PutMapping("/steps/update")
    public ResponseEntity<SuccessResponseModel<Map<String, Object>>> updateCompletedSteps(@RequestBody AuthorInformationRequest request) {
        submissionService.updateCompletedSteps(request.submissionId(), request.completedSteps());

        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.OK.value(),
                        "Author information saved successfully."),
                HttpStatus.OK);
    }

    @PostMapping("/manuscript-details/save")
    public ResponseEntity<SuccessResponseModel<Map<String,Object>>> manuscriptDetails(@RequestBody ManuscriptDetailsRequest request) {
        Profile profile = profileService.userProfileDetailsByUserId(request.userId());

        try {
            Long submissionId = submissionService.saveManuscriptDetails(request, profile);

            return new ResponseEntity<>(
                    new SuccessResponseModel<>(
                            HttpStatus.CREATED.value(), Map.of("submissionId", submissionId), "Manuscript details saved successfully."),
                    HttpStatus.CREATED);

        } catch (RuntimeException e) {
            throw new SubmissionRequestException("Unable to process the request.");
        }
    }

    @PutMapping("/manuscript-details/update")
    public ResponseEntity<Map<String, Object>> updateManuscriptDetails(@RequestBody ManuscriptDetailsRequest request) {
        try {
            Submission ManuscriptDetails = submissionService.updateManuscriptDetails(request);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("message", "Manuscript details saved successfully.");
            response.put("submissionId", ManuscriptDetails.getId());
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            throw new SubmissionRequestException("Failed to update manuscript details.");
        }
    }

    @PostMapping("/author-informations/save")
    public ResponseEntity<SuccessResponseModel<Map<String, Object>>> saveAuthors(@RequestBody AuthorInformationRequest request) {
        Submission submission = submissionService.returnSubmission(request.submissionId());
        List<Author> savedAuthors = submissionService.saveAuthors(request.authors(), submission);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("authors", savedAuthors);

        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.OK.value(),
                        responseData,
                        "Authors saved successfully."),
                HttpStatus.OK);
    }

    @DeleteMapping("/author/remove/{submissionId}/{authorId}")
    public ResponseEntity<SuccessResponseModel<Void>> removeAuthor(
            @PathVariable Long submissionId,
            @PathVariable Long authorId) {
        submissionService.removeAuthor(submissionId, authorId);
        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.OK.value(),
                        null,
                        "Author removed successfully."),
                HttpStatus.OK);
    }

    @PostMapping("/manuscript-files/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("submissionId") Long submissionId
    ) {
        try {
            FileUpload savedFile = submissionService.saveFile(submissionId, file);
            Map<String, Object> data = new HashMap<>();
            data.put("id", savedFile.getId());
            data.put("fileName", savedFile.getStoredName());
            data.put("originalName", savedFile.getOriginalName());
            data.put("size", savedFile.getSize());
            data.put("fileUrl", savedFile.getFileUrl());
            return ResponseEntity.ok(Map.of("code", 200, "data", data));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("code", 500, "message", "File upload failed"));
        }
    }

    @DeleteMapping("/manuscript-files/remove/{submissionId}/{fileId}")
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

    @PostMapping("/reviewer-informations/save")
    public ApiResponse<?> saveReviewerInformations(@RequestBody ReviewerSubmissionRequest request) {
        submissionService.saveReviewers(request);
        return new ApiResponse<>(200, "Reviewers saved successfully");
    }

    @DeleteMapping("/reviewer/remove/{submissionId}/{reviewerId}")
    public ApiResponse<?> deleteReviewer(@PathVariable Long submissionId, @PathVariable Long reviewerId) {
        submissionService.removeReviewer(submissionId, reviewerId);
        return new ApiResponse<>(200, "Reviewer deleted successfully");
    }

    @PostMapping("/additional-informations/save")
    public ApiResponse<?> saveAdditionalInformation(@RequestBody AdditionalInformationRequest request) {
        Submission saved = submissionService.saveAdditionalInformation(request);
        return new ApiResponse<>(201, "Additional information saved successfully", Map.of("submissionId", saved.getId()));
    }

    @PutMapping("/submit-manuscript/save")
    public ApiResponse<?> submitManuscript(@RequestBody SubmitManuscriptRequest request) {
        Submission saved = submissionService.submitManuscript(request);
        return new ApiResponse<>(200, "Manuscript submitted successfully", Map.of("submissionId", saved.getId()));
    }



}
