package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.dto.response.SuccessResponseModelPublication;
import com.himusharier.ajps_backend.model.FileUpload;
import com.himusharier.ajps_backend.model.Issue;
import com.himusharier.ajps_backend.model.Paper;
import com.himusharier.ajps_backend.model.Submission;
import com.himusharier.ajps_backend.repository.FileUploadRepository;
import com.himusharier.ajps_backend.repository.IssueRepository;
import com.himusharier.ajps_backend.repository.PaperRepository;
import com.himusharier.ajps_backend.repository.SubmissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PublicationService {

    private final PaperRepository paperRepository;
    private final IssueRepository issueRepository;
    private final SubmissionRepository submissionRepository;
    private final FileUploadRepository fileUploadRepository; // Ensure this is injected if FileUpload is to be managed directly

    @Transactional
    public SuccessResponseModelPublication<Long> publishManuscript(Long submissionId, Long issueId, Long fileId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + submissionId));

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found with ID: " + issueId));

        FileUpload fileUpload = fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found with ID: " + fileId));

        // Prevent duplicate publication for the same submission
        if (paperRepository.findBySubmission(submission).isPresent()) {
            throw new IllegalArgumentException("This submission is already published or associated with a paper.");
        }

        // Create the Paper entity
        Paper paper = Paper.builder()
                .submission(submission)
                .issue(issue)
                .fileUpload(fileUpload)
                .build();

        Paper savedPaper = paperRepository.save(paper);

        return new SuccessResponseModelPublication<>(
                HttpStatus.CREATED.value(),
                "Article published and linked to issue successfully.",
                savedPaper.getId()
        );
    }

    /**
     * Unpublishes a manuscript by deleting its associated Paper record.
     *
     * @param submissionId The ID of the submission to unpublish.
     * @return A success response indicating the article was unpublished.
     * @throws IllegalArgumentException if the submission or associated paper is not found.
     */
    @Transactional
    public SuccessResponseModelPublication<Void> unpublishManuscript(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + submissionId));

        // Find the Paper record linked to this submission
        Optional<Paper> optionalPaper = paperRepository.findBySubmission(submission);

        if (optionalPaper.isEmpty()) {
            throw new IllegalArgumentException("No published paper found for submission ID: " + submissionId);
        }

        Paper paperToDelete = optionalPaper.get();

        // If Paper model has @OneToOne(cascade = CascadeType.ALL) with FileUpload,
        // deleting the Paper will also delete the associated FileUpload record.
        // If the actual file on the disk needs to be managed (e.g., removed or flagged differently),
        // that logic would be handled by a FileUploadService, which would be called here.
        // For this specific request, we assume cascade handles the database record deletion for FileUpload.

        paperRepository.delete(paperToDelete);

        return new SuccessResponseModelPublication<>(
                HttpStatus.OK.value(),
                "Article unpublished and paper record deleted successfully.",
                null
        );
    }
}