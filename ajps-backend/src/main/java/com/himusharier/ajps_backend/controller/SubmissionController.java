package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.SendToReviewRequest;
import com.himusharier.ajps_backend.dto.response.ApiResponse;
import com.himusharier.ajps_backend.dto.response.SuccessResponseModel;
import com.himusharier.ajps_backend.dto.response.submission.FileUploadResponse;
import com.himusharier.ajps_backend.dto.submission.*;
import com.himusharier.ajps_backend.dto.response.SubmissionListResponse;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.model.*;
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
                .map(UserSubmissionListMapperUtil::submissionListResponseFromSubmission)
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

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("id", submissionDetails.getId());
            responseData.put("submissionNumber", submissionDetails.getSubmissionNumber());

//            responseData.put("journalName", submissionDetails.getJournal().getJournalName()); // Get journal name from Journal entity
            // --- IMPORTANT CHANGE HERE ---
            // Instead of just journalName, return the journal object with its ID
            Map<String, Object> journalData = new HashMap<>();
            if (submissionDetails.getJournal() != null) {
                journalData.put("id", submissionDetails.getJournal().getId());
                journalData.put("journalName", submissionDetails.getJournal().getJournalName());
                // Add any other journal properties you might need on the frontend
            }
            responseData.put("journal", journalData); // Return the journal object
            // --- END IMPORTANT CHANGE ---

            Map<String, Object> ownerData = new HashMap<>();
            if (submissionDetails.getJournal() != null) {
                ownerData.put("userId", submissionDetails.getProfile().getAuth().getUserId());
            }
            responseData.put("owner", ownerData);

            responseData.put("manuscriptTitle", submissionDetails.getManuscriptTitle());
            responseData.put("manuscriptCategory", submissionDetails.getManuscriptCategory());
            responseData.put("abstractContent", submissionDetails.getAbstractContent());
            responseData.put("manuscriptKeywords", submissionDetails.getManuscriptKeywords());
            responseData.put("comments", submissionDetails.getComments());
            responseData.put("submissionConfirmation", submissionDetails.isSubmissionConfirmation());
            responseData.put("submissionStatus", submissionDetails.getSubmissionStatus());
            responseData.put("createdAt", submissionDetails.getCreatedAt());
            responseData.put("submittedAt", submissionDetails.getSubmittedAt());
            responseData.put("updatedAt", submissionDetails.getUpdatedAt());
            responseData.put("isPaymentDue", submissionDetails.isPaymentDue());
            responseData.put("completedSteps", submissionDetails.getCompletedSteps());
            responseData.put("isEditable", submissionDetails.isEditable());
            responseData.put("authors", submissionDetails.getAuthors());
            responseData.put("files", submissionDetails.getFiles());
            responseData.put("submissionReviewers", submissionDetails.getSubmissionReviewers());


            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("code", HttpStatus.OK.value());
            response.put("data", responseData); // Return the mapped data
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
            @RequestParam("submissionId") Long submissionId,
            @RequestParam("fileOrigin") String fileOrigin
    ) {
        try {
            FileUpload savedFile = submissionService.saveFile(submissionId, fileOrigin, file);
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
        List<SubmissionReviewer> savedSubmissionReviewer = submissionService.saveReviewers(request);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("reviewer", savedSubmissionReviewer);
        return new ApiResponse<>(200, "Reviewers saved successfully", responseData);
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

    @DeleteMapping("/delete/{submissionId}")
    public ResponseEntity<SuccessResponseModel<Void>> deleteSubmission(
            @PathVariable Long submissionId) {

        submissionService.deleteSubmission(submissionId);
        return new ResponseEntity<>(
                new SuccessResponseModel<>(
                        HttpStatus.OK.value(),
                        null,
                        "Submission deleted successfully."),
                HttpStatus.OK);
    }

    @PutMapping("/update-status/{submissionId}")
    public ResponseEntity<?> updateSubmissionStatus(@PathVariable Long submissionId, @RequestBody Map<String, String> statusUpdate) {
        String newStatusString = statusUpdate.get("status");

        if (newStatusString == null || newStatusString.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(400, "error", "New status cannot be empty."));
        }

        try {
            // Call your service layer to update the status
            submissionService.updateSubmissionStatus(submissionId, newStatusString);
            return ResponseEntity.ok(new ApiResponse(200, "success", "Submission status updated successfully."));
        } catch (Exception e) {
            // Catch any other unexpected errors
            return ResponseEntity.status(500).body(new ApiResponse(500, "error", "Failed to update submission status: " + e.getMessage()));
        }
    }

    // --- NEW ENDPOINT FOR SENDING TO REVIEW ---
    // --- CORRECTED ENDPOINT FOR SENDING TO REVIEW ---
    @PostMapping("/{submissionId}/send-to-review")
    public ResponseEntity<ApiResponse<?>> sendSubmissionToReview(
            @PathVariable Long submissionId,
            @RequestBody SendToReviewRequest request) { // <--- CHANGE to use the DTO
        try {
            Submission updatedSubmission = submissionService.sendSubmissionToReview(submissionId, request.getFileId()); // Access fileId from DTO
            return ResponseEntity.ok(new ApiResponse(200, "Submission sent to review successfully.", updatedSubmission));
        } catch (SubmissionRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(HttpStatus.NOT_FOUND.value(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to send submission to review: " + e.getMessage()));
        }
    }

    // --- NEW ENDPOINT: ACCEPT AND SKIP REVIEW ---
    @PutMapping("/{submissionId}/accept-skip-review")
    public ResponseEntity<ApiResponse<?>> acceptAndSkipReview(
            @PathVariable Long submissionId) {
        try {
            Submission updatedSubmission = submissionService.acceptAndSkipReview(submissionId);
            return ResponseEntity.ok(new ApiResponse(200, "Submission accepted and moved to copy-editing.", updatedSubmission));
        } catch (SubmissionRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(HttpStatus.BAD_REQUEST.value(), "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "error", "Failed to accept and skip review: " + e.getMessage()));
        }
    }

    // --- NEW ENDPOINT: SELECT FILE FOR COPY EDITING ---
    @PutMapping("/{submissionId}/select-copy-editing-file")
    public ResponseEntity<ApiResponse<?>> selectCopyEditingFile(
            @PathVariable Long submissionId,
            @RequestBody SendToReviewRequest request) { // Reusing SendToReviewRequest as it just needs fileId
        try {
            Submission updatedSubmission = submissionService.selectFileForCopyEditing(submissionId, request.getFileId());
            return ResponseEntity.ok(new ApiResponse(200, "File selected for copy-editing successfully.", updatedSubmission));
        } catch (SubmissionRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Failed to select file for copy-editing.", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to select file for copy-editing."));
        }
    }

    // --- NEW ENDPOINT: Upload Revision File ---
    @PostMapping("/{submissionId}/upload-revision-file")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadRevisionFile(
            @PathVariable Long submissionId,
            @RequestParam("file") MultipartFile file) {
        try {
            FileUpload uploadedFile = submissionService.uploadRevisionFile(submissionId, file);
            FileUploadResponse response = FileUploadResponse.builder()
                    .id(uploadedFile.getId())
                    .fileOrigin(uploadedFile.getFileOrigin().name())
                    .originalName(uploadedFile.getOriginalName())
                    .storedName(uploadedFile.getStoredName())
                    .size(uploadedFile.getSize())
                    .type(uploadedFile.getType())
                    .fileUrl(uploadedFile.getFileUrl())
                    .isReviewFile(uploadedFile.isReviewFile())
                    .isCopyEditingFile(uploadedFile.isCopyEditingFile())
                    .build();
            return ResponseEntity.ok(new ApiResponse<>(200, "Revision file uploaded successfully.", response));
        } catch (SubmissionRequestException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, e.getMessage(), null));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(500, "Failed to upload revision file: " + e.getMessage(), null));
        }
    }

    // --- NEW ENDPOINT: Upload Copyedited File ---
    @PostMapping("/{submissionId}/upload-copyedited-file")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadCopyeditedFile(
            @PathVariable Long submissionId,
            @RequestParam("file") MultipartFile file) {
        try {
            FileUpload uploadedFile = submissionService.uploadCopyeditedFile(submissionId, file);
            FileUploadResponse response = FileUploadResponse.builder()
                    .id(uploadedFile.getId())
                    .fileOrigin(uploadedFile.getFileOrigin().name())
                    .originalName(uploadedFile.getOriginalName())
                    .storedName(uploadedFile.getStoredName())
                    .size(uploadedFile.getSize())
                    .type(uploadedFile.getType())
                    .fileUrl(uploadedFile.getFileUrl())
                    .isReviewFile(uploadedFile.isReviewFile())
                    .isCopyEditingFile(uploadedFile.isCopyEditingFile())
                    .build();
            return ResponseEntity.ok(new ApiResponse<>(200, "Copyedited file uploaded successfully.", response));
        } catch (SubmissionRequestException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, e.getMessage(), null));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(500, "Failed to upload copyedited file: " + e.getMessage(), null));
        }
    }

}