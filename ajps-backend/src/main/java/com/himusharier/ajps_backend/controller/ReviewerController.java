package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.ReviewerDTO;
import com.himusharier.ajps_backend.service.ReviewerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviewers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // or specify frontend origin
public class ReviewerController {

    private final ReviewerService reviewerService;

    @GetMapping("/get-all-reviewers")
    public ResponseEntity<List<ReviewerDTO>> getAllReviewers() {
        return ResponseEntity.ok(reviewerService.getAllReviewers());
    }

    @PutMapping("/{profileId}/assign-journals")
    public ResponseEntity<Void> assignJournals(
            @PathVariable Long profileId,
            @RequestBody List<Long> journalIds) {
        reviewerService.assignJournalsToReviewer(profileId, journalIds);
        return ResponseEntity.ok().build();
    }
}
