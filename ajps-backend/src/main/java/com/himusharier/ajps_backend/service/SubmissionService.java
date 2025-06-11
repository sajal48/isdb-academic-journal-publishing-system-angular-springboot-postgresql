package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.FileUploadOrigin;
import com.himusharier.ajps_backend.constants.SubmissionStatus;
import com.himusharier.ajps_backend.dto.submission.*;
import com.himusharier.ajps_backend.exception.SubmissionRequestException;
import com.himusharier.ajps_backend.model.*;
import com.himusharier.ajps_backend.repository.AuthorRepository;
import com.himusharier.ajps_backend.repository.FileUploadRepository;
import com.himusharier.ajps_backend.repository.ReviewerRepository;
import com.himusharier.ajps_backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    @Value("${app.base.url}")
    private String baseUrl;

    @Value("${file.upload-dir}")
    private String uploadDirectory;

    private final SubmissionRepository submissionRepository;
    private final AuthorRepository authorRepository;
    private final FileUploadRepository fileUploadRepository;
    private final ReviewerRepository reviewerRepository;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            AuthorRepository authorRepository,
            FileUploadRepository fileUploadRepository,
            ReviewerRepository reviewerRepository
    ) {
        this.submissionRepository = submissionRepository;
        this.authorRepository = authorRepository;
        this.fileUploadRepository = fileUploadRepository;
        this.reviewerRepository = reviewerRepository;
    }

    public Submission returnSubmissionDetails(Profile profile, Long submissionId) {
        Optional<Submission> optionalSubmission = submissionRepository.findByIdAndProfile(submissionId, profile);

        if (optionalSubmission.isPresent()) {
            return optionalSubmission.get();

        } else {
            throw new SubmissionRequestException("Submission not found for given user and submission ID.");
        }
    }

    public Submission returnSubmission(Long submissionId) {
        Optional<Submission> optionalSubmission = submissionRepository.findById(submissionId);

        if (optionalSubmission.isPresent()) {
            return optionalSubmission.get();

        } else {
            throw new SubmissionRequestException("Submission not found for given submission ID.");
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
                .isEditable(true)
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

    @Transactional
    public void updateCompletedSteps(Long submissionId, List<String> completedSteps) {
        Submission existingSubmission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + submissionId));

        // Use LinkedHashSet to preserve insertion order and avoid duplicates
        Set<String> steps = new LinkedHashSet<>();

        // Load existing steps (split by comma)
        if (existingSubmission.getCompletedSteps() != null && !existingSubmission.getCompletedSteps().isEmpty()) {
            Arrays.stream(existingSubmission.getCompletedSteps().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .forEach(steps::add);
        }

        // Add new steps, trim and filter empty strings
        completedSteps.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .forEach(steps::add);

        // Set updated comma-separated steps back to entity
        existingSubmission.setCompletedSteps(String.join(",", steps));
        submissionRepository.save(existingSubmission);
    }




    @Transactional
    public List<Author> saveAuthors(List<AuthorDTO> authors, Submission submission) {
        List<Author> savedAuthors = new ArrayList<>();

        for (AuthorDTO authorInfo : authors) {
            Author author = new Author();
            author.setName(authorInfo.name());
            author.setEmail(authorInfo.email());
            author.setInstitution(authorInfo.institution());
            author.setCorresponding(authorInfo.corresponding());
            author.setSubmission(submission);

            savedAuthors.add(authorRepository.save(author));
        }

        return savedAuthors;
    }

    @Transactional
    public void removeAuthor(Long submissionId, Long authorId) {
        authorRepository.deleteBySubmissionIdAndId(submissionId, authorId);
    }





    public FileUpload saveFile(Long submissionId, MultipartFile file) throws IOException {
        if (file.isEmpty() || file.getOriginalFilename() == null) {
            throw new IOException("Invalid file: file is empty or has no original name");
        }
        String originalName = file.getOriginalFilename();
        String fileExtension = originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase();
        String storedName = UUID.randomUUID() + "." + fileExtension;

        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(storedName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fullFileUrl = baseUrl + "/" + uploadDirectory + "/" + storedName;

        Submission existingSubmission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + submissionId));


        FileUpload fileUpload = FileUpload.builder()
                .submission(existingSubmission)
                .fileOrigin(FileUploadOrigin.SUBMISSION)
                .originalName(originalName)
                .storedName(storedName)
                .type(file.getContentType())
                .size(file.getSize())
//                .path(filePath.toString())
                .fileUrl(fullFileUrl)
                .build();

        return fileUploadRepository.save(fileUpload);
    }

    public void deleteFile(Long submissionId, Long fileId) throws IOException {
        List<FileUpload> files = fileUploadRepository.findBySubmissionId(submissionId);
        for (FileUpload file : files) {
            if (file.getId().equals(fileId)) {
                Path uploadPath = Paths.get(uploadDirectory);
                Path filePath = uploadPath.resolve(file.getStoredName());
                Files.deleteIfExists(Paths.get(filePath.toString()));
                fileUploadRepository.delete(file);
                break;
            }
        }
    }






    public void saveReviewers(ReviewerSubmissionRequest request) {
        Submission submission = submissionRepository.findById(request.submissionId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        for (ReviewerDTO dto : request.reviewers()) {
            Reviewer reviewer = new Reviewer(
                    dto.name(),
                    dto.email(),
                    dto.institution(),
                    submission
            );
            reviewerRepository.save(reviewer);
        }
    }

    public List<ReviewerDTO> getReviewersBySubmissionId(Long submissionId) {
        return reviewerRepository.findBySubmissionId(submissionId)
                .stream()
                .map(r -> new ReviewerDTO(
                        r.getId(),
                        r.getName(),
                        r.getEmail(),
                        r.getInstitution()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeReviewer(Long submissionId, Long reviewerId) {
        reviewerRepository.deleteByIdAndSubmissionId(reviewerId, submissionId);
    }






    @Transactional
    public Submission saveAdditionalInformation(AdditionalInformationRequest request) {
        Submission submission = submissionRepository.findById(request.submissionId())
                .orElseThrow(() -> new SubmissionRequestException("Submission not found with ID: " + request.submissionId()));

        submission.setComments(request.comments());
        submission.setSubmissionConfirmation(request.confirmed());
        if (request.completedSteps() != null && !request.completedSteps().isEmpty()) {
            updateCompletedSteps(request.submissionId(), request.completedSteps());
        }

        return submissionRepository.save(submission);
    }




    @Transactional
    public Submission submitManuscript(SubmitManuscriptRequest request) {
        Submission submission = submissionRepository.findById(request.submissionId())
                .orElseThrow(() -> new SubmissionRequestException("Submission not found with ID: " + request.submissionId()));

        try {
            submission.setSubmissionStatus(SubmissionStatus.valueOf(request.submissionStatus()));
            if (request.completedSteps() != null && !request.completedSteps().isEmpty()) {
                updateCompletedSteps(request.submissionId(), request.completedSteps());
            }

        } catch (IllegalArgumentException e) {
            throw new SubmissionRequestException("Invalid submission status: " + request.submissionStatus());
        }

        submission.setSubmissionDateTime(); // Sets submittedAt using BdtZoneTimeUtil
//        submission.setEditable(true); // Lock submission after final submission

        return submissionRepository.save(submission);
    }





    @Transactional
    public void deleteSubmission(Long submissionId) {
        // First delete associated files physically from storage
        List<FileUpload> files = fileUploadRepository.findBySubmissionId(submissionId);
        for (FileUpload file : files) {
            try {
                Path uploadPath = Paths.get(uploadDirectory);
                Path filePath = uploadPath.resolve(file.getStoredName());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new SubmissionRequestException("Failed to delete file: " + file.getOriginalName());
            }
        }

        // The cascade will handle authors, files, and reviewers deletion
        submissionRepository.deleteById(submissionId);
    }



}
