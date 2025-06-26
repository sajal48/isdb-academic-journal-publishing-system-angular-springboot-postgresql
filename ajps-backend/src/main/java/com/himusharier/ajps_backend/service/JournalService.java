package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.dto.request.AdminJournalDto;
import com.himusharier.ajps_backend.dto.request.IssueDto;
import com.himusharier.ajps_backend.model.Issue;
import com.himusharier.ajps_backend.model.Journal;
import com.himusharier.ajps_backend.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;

    @Value("${app.base.url}")
    private String baseUrl;

    @Value("${upload.journal.directory}")
    private String uploadDirectory; // e.g. "ajps-uploads/journals"

    public List<AdminJournalDto> getAllJournals() {
        // Alternative approach if you don't want to add the repository method:
        // return journalRepository.findAll().stream()
        //         .map(this::mapJournalToAdminJournalDto)
        //         .collect(Collectors.toList());

        // Recommended approach - use fetch join to avoid N+1 query problem
        return journalRepository.findAllWithIssues().stream()
                .map(this::mapJournalToAdminJournalDto)
                .collect(Collectors.toList());
    }

    private AdminJournalDto mapJournalToAdminJournalDto(Journal journal) {
        // Map issues with null safety and sorting by volume/number
        List<IssueDto> issueDtos = journal.getIssues() != null ?
                journal.getIssues().stream()
                        .sorted((i1, i2) -> {
                            // Sort by volume first (descending), then by number (descending)
                            int volumeCompare = Integer.compare(i2.getVolume(), i1.getVolume());
                            if (volumeCompare != 0) return volumeCompare;
                            return Integer.compare(i2.getNumber(), i1.getNumber());
                        })
                        .map(this::mapIssueToIssueDto)
                        .collect(Collectors.toList()) :
                List.of();

        return AdminJournalDto.builder()
                .id(journal.getId())
                .journalName(journal.getJournalName())
                .issn(journal.getIssn())
                .frequency(journal.getFrequency())
                .journalType(journal.getJournalType())
                .journalCode(journal.getJournalCode())
                .contactEmail(journal.getContactEmail())
                .journalUrl(journal.getJournalUrl())
                .aimsScopes(journal.getAimsScopes())
                .aboutJournal(journal.getAboutJournal())
                .coverImageUrl(buildFullImageUrl(journal.getCoverImageUrl()))
                .issues(issueDtos) // Include complete issue details
                .build();
    }

    private IssueDto mapIssueToIssueDto(Issue issue) {
        return IssueDto.builder()
                .id(issue.getId())
                .number(issue.getNumber())
                .volume(issue.getVolume())
                .status(issue.getStatus() != null ? issue.getStatus().toString() : "UNKNOWN")
                .publicationDate(issue.getPublicationDate())
                .build();
    }

    public AdminJournalDto createJournal(AdminJournalDto dto, MultipartFile coverImage) {
        // Validate unique constraints
        if (journalRepository.existsByIssn(dto.getIssn())) {
            throw new IllegalArgumentException("ISSN already exists.");
        }
        if (journalRepository.existsByJournalCode(dto.getJournalCode())) {
            throw new IllegalArgumentException("Journal code already exists.");
        }

        // Convert DTO to entity
        Journal journal = convertToEntity(dto);

        // Handle cover image upload
        if (coverImage != null && !coverImage.isEmpty()) {
            String fileName = saveImageToInternalStorage(coverImage, journal.getJournalCode());
            String fullImageUrl = buildFullImageUrl(fileName);
            journal.setCoverImageUrl(fullImageUrl);
        }

        // Save journal and return DTO with full image URL
        Journal savedJournal = journalRepository.save(journal);
        return mapJournalToAdminJournalDto(savedJournal);
    }

    public AdminJournalDto updateJournal(Long id, AdminJournalDto dto, MultipartFile coverImage) {
        // Find existing journal
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal not found."));

        // Store old image URL for potential deletion
        String oldImageUrl = journal.getCoverImageUrl();

        // Copy properties from DTO to entity (excluding id and coverImageUrl)
        BeanUtils.copyProperties(dto, journal, "id", "coverImageUrl");

        // Handle cover image update
        if (coverImage != null && !coverImage.isEmpty()) {
            // Delete old image if exists
            deleteImageByUrl(oldImageUrl);

            // Save new image
            String fileName = saveImageToInternalStorage(coverImage, journal.getJournalCode());
            String fullImageUrl = buildFullImageUrl(fileName);
            journal.setCoverImageUrl(fullImageUrl);
        }
        // If no new image provided, keep the existing image URL
        else if (oldImageUrl != null) {
            journal.setCoverImageUrl(oldImageUrl);
        }

        // Save updated journal and return DTO
        Journal updatedJournal = journalRepository.save(journal);
        return mapJournalToAdminJournalDto(updatedJournal);
    }

    public void deleteJournal(Long id) {
        journalRepository.findById(id).ifPresent(journal -> {
            // Delete associated image
            deleteImageByUrl(journal.getCoverImageUrl());
            // Delete journal
            journalRepository.deleteById(id);
        });
    }

    /**
     * Build full image URL from filename
     */
    private String buildFullImageUrl(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return null;
        }

        // If it's already a full URL, return as is
        if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
            return fileName;
        }

        // Build full URL: http://localhost:8090/ajps-uploads/journals/filename.jpg
        return baseUrl + "/" + uploadDirectory + "/" + fileName;
    }

    /**
     * Extract filename from full URL
     */
    private String extractFileNameFromUrl(String fullUrl) {
        if (fullUrl == null || fullUrl.isBlank()) {
            return null;
        }

        // If it's just a filename, return as is
        if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
            return fullUrl;
        }

        // Extract filename from full URL
        String urlPath = "/" + uploadDirectory + "/";
        int index = fullUrl.indexOf(urlPath);
        if (index != -1) {
            return fullUrl.substring(index + urlPath.length());
        }

        return null;
    }

    /**
     * Delete image by full URL
     */
    private void deleteImageByUrl(String imageUrl) {
        String fileName = extractFileNameFromUrl(imageUrl);
        if (fileName != null && !fileName.isBlank()) {
            Path fullPath = Paths.get(uploadDirectory, fileName);
            try {
                Files.deleteIfExists(fullPath);
            } catch (IOException e) {
                // Log error but don't throw exception to avoid breaking the main operation
                System.err.println("Failed to delete image file: " + fullPath + ", Error: " + e.getMessage());
            }
        }
    }

    private Journal convertToEntity(AdminJournalDto dto) {
        return Journal.builder()
                .journalName(dto.getJournalName())
                .issn(dto.getIssn())
                .frequency(dto.getFrequency())
                .journalType(dto.getJournalType())
                .journalCode(dto.getJournalCode())
                .contactEmail(dto.getContactEmail())
                .journalUrl(dto.getJournalUrl())
                .aimsScopes(dto.getAimsScopes())
                .aboutJournal(dto.getAboutJournal())
                .build();
    }

    private String saveImageToInternalStorage(MultipartFile file, String code) {
        try {
            // Validate file extension
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || !originalFileName.contains(".")) {
                throw new IllegalArgumentException("Invalid file name");
            }

            String ext = originalFileName
                    .substring(originalFileName.lastIndexOf(".") + 1)
                    .toLowerCase();

            if (!ext.matches("jpg|jpeg|png|gif|bmp")) {
                throw new IllegalArgumentException("Unsupported image format. Allowed: jpg, jpeg, png, gif, bmp");
            }

            // Generate unique filename
            String fileName = "journal_" + code + "_" + System.currentTimeMillis() + "." + ext;

            // Create directory if it doesn't exist
            File dir = new File(uploadDirectory);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    throw new RuntimeException("Failed to create upload directory: " + uploadDirectory);
                }
            }

            // Save compressed image
            Path filePath = Paths.get(uploadDirectory, fileName);

            try (InputStream input = file.getInputStream();
                 OutputStream output = Files.newOutputStream(filePath, StandardOpenOption.CREATE)) {

                Thumbnails.of(input)
                        .size(500, 500)         // Resize if needed
                        .outputFormat(ext)      // Keep original format
                        .outputQuality(0.75f)   // Compression quality
                        .toOutputStream(output);
            }

            return fileName; // Return only filename, not full URL
        } catch (IOException e) {
            throw new RuntimeException("Failed to save compressed cover image.", e);
        }
    }

    // Removed the old methods that are no longer needed:
    // - convertToDtoWithFullImageUrl (functionality moved to mapJournalToAdminJournalDto)
    // - deleteOldImageIfExists (replaced with deleteImageByUrl)

    public AdminJournalDto getJournalByCode(String journalUrl) {
        if (journalUrl == null || journalUrl.isEmpty() || journalUrl.equals("undefined")) {
            throw new IllegalArgumentException("Journal code is required");
        }

        return journalRepository.findByJournalUrl(journalUrl)
                .map(this::mapJournalToAdminJournalDto)
                .orElseThrow(() -> new IllegalArgumentException("Journal not found with code: " + journalUrl));
    }

}