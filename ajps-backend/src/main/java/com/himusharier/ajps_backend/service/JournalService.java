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
        return journalRepository.findAll().stream()
                .map(this::mapJournalToAdminJournalDto)
                .collect(Collectors.toList());
    }

    private AdminJournalDto mapJournalToAdminJournalDto(Journal journal) {
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
                .coverImageUrl(journal.getCoverImageUrl())
                // Map issues to IssueDto
                .issues(journal.getIssues().stream()
                        .map(this::mapIssueToIssueDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private IssueDto mapIssueToIssueDto(Issue issue) {
        return IssueDto.builder()
                .id(issue.getId())
                .number(issue.getNumber())
                .volume(issue.getVolume())
                .status(issue.getStatus().toString())
                .publicationDate(issue.getPublicationDate())
                .build();
    }

    public AdminJournalDto createJournal(AdminJournalDto dto, MultipartFile coverImage) {
        if (journalRepository.existsByIssn(dto.getIssn())) {
            throw new IllegalArgumentException("ISSN already exists.");
        }
        if (journalRepository.existsByJournalCode(dto.getJournalCode())) {
            throw new IllegalArgumentException("Journal code already exists.");
        }
        Journal journal = convertToEntity(dto);

        if (coverImage != null && !coverImage.isEmpty()) {
            String fileName = saveImageToInternalStorage(coverImage, journal.getJournalCode());
            journal.setCoverImageUrl(fileName); // Only file name saved
        }

        return convertToDtoWithFullImageUrl(journalRepository.save(journal));
    }

    public AdminJournalDto updateJournal(Long id, AdminJournalDto dto, MultipartFile coverImage) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal not found."));

        BeanUtils.copyProperties(dto, journal, "id", "coverImageUrl");

        if (coverImage != null && !coverImage.isEmpty()) {
            deleteOldImageIfExists(journal.getCoverImageUrl());
            String fileName = saveImageToInternalStorage(coverImage, journal.getJournalCode());
            journal.setCoverImageUrl(fileName);
        }

        return convertToDtoWithFullImageUrl(journalRepository.save(journal));
    }

    public void deleteJournal(Long id) {
        journalRepository.findById(id).ifPresent(journal -> {
            deleteOldImageIfExists(journal.getCoverImageUrl());
            journalRepository.deleteById(id);
        });
    }

    private AdminJournalDto convertToDtoWithFullImageUrl(Journal journal) {
        String imageUrl = null;
        if (journal.getCoverImageUrl() != null && !journal.getCoverImageUrl().isBlank()) {
            imageUrl = baseUrl + "/" + uploadDirectory + "/" + journal.getCoverImageUrl(); // e.g. http://localhost:8080/ajps-uploads/journals/image.jpg
        }

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
                .coverImageUrl(imageUrl)
                .build();
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
            String ext = file.getOriginalFilename()
                    .substring(file.getOriginalFilename().lastIndexOf(".") + 1)
                    .toLowerCase();

            if (!ext.matches("jpg|jpeg|png|gif|bmp")) {
                throw new RuntimeException("Unsupported image format. Allowed: jpg, jpeg, png, gif, bmp");
            }

            String fileName = "journal_" + code + "_" + System.currentTimeMillis() + "." + ext;

            File dir = new File(uploadDirectory);
            if (!dir.exists()) dir.mkdirs();

            Path filePath = Paths.get(uploadDirectory, fileName);

            try (InputStream input = file.getInputStream();
                 OutputStream output = Files.newOutputStream(filePath)) {

                Thumbnails.of(input)
                        .size(500, 500)         // Resize if needed (adjust as appropriate)
                        .outputFormat(ext)      // Keep original format
                        .outputQuality(0.75f)   // Adjust compression quality (0.0 = worst, 1.0 = best)
                        .toOutputStream(output);
            }

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save compressed cover image.", e);
        }
    }


    private void deleteOldImageIfExists(String fileName) {
        if (fileName != null && !fileName.isBlank()) {
            Path fullPath = Paths.get(uploadDirectory, fileName);
            try {
                Files.deleteIfExists(fullPath);
            } catch (IOException ignored) {}
        }
    }
}
