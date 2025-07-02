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
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;

    @Value("${upload.journal.directory}")
    private String uploadDirectory; // e.g. "ajps-uploads/journals"

    private String getLocalBaseUrl() {
        try {
            String ip = InetAddress.getLocalHost().getHostAddress();
            return "http://" + ip + ":8090";
        } catch (UnknownHostException e) {
            return "http://localhost:8090"; // fallback
        }
    }

    public List<AdminJournalDto> getAllJournals() {
        return journalRepository.findAllWithIssues().stream()
                .map(this::mapJournalToAdminJournalDto)
                .collect(Collectors.toList());
    }

    private AdminJournalDto mapJournalToAdminJournalDto(Journal journal) {
        List<IssueDto> issueDtos = journal.getIssues() != null ?
                journal.getIssues().stream()
                        .sorted((i1, i2) -> {
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
                .issues(issueDtos)
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
        if (journalRepository.existsByIssn(dto.getIssn())) {
            throw new IllegalArgumentException("ISSN already exists.");
        }
        if (journalRepository.existsByJournalCode(dto.getJournalCode())) {
            throw new IllegalArgumentException("Journal code already exists.");
        }

        Journal journal = convertToEntity(dto);

        if (coverImage != null && !coverImage.isEmpty()) {
            String fileName = saveImageToInternalStorage(coverImage, journal.getJournalCode());
            String fullImageUrl = buildFullImageUrl(fileName);
            journal.setCoverImageUrl(fullImageUrl);
        }

        Journal savedJournal = journalRepository.save(journal);
        return mapJournalToAdminJournalDto(savedJournal);
    }

    public AdminJournalDto updateJournal(Long id, AdminJournalDto dto, MultipartFile coverImage) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal not found."));

        String oldImageUrl = journal.getCoverImageUrl();

        BeanUtils.copyProperties(dto, journal, "id", "coverImageUrl");

        if (coverImage != null && !coverImage.isEmpty()) {
            deleteImageByUrl(oldImageUrl);
            String fileName = saveImageToInternalStorage(coverImage, journal.getJournalCode());
            String fullImageUrl = buildFullImageUrl(fileName);
            journal.setCoverImageUrl(fullImageUrl);
        } else if (oldImageUrl != null) {
            journal.setCoverImageUrl(oldImageUrl);
        }

        Journal updatedJournal = journalRepository.save(journal);
        return mapJournalToAdminJournalDto(updatedJournal);
    }

    public void deleteJournal(Long id) {
        journalRepository.findById(id).ifPresent(journal -> {
            deleteImageByUrl(journal.getCoverImageUrl());
            journalRepository.deleteById(id);
        });
    }

    private String buildFullImageUrl(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return null;
        }

        if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
            return fileName;
        }

        return getLocalBaseUrl() + "/" + uploadDirectory + "/" + fileName;
    }

    private String extractFileNameFromUrl(String fullUrl) {
        if (fullUrl == null || fullUrl.isBlank()) {
            return null;
        }

        if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
            return fullUrl;
        }

        String urlPath = "/" + uploadDirectory + "/";
        int index = fullUrl.indexOf(urlPath);
        if (index != -1) {
            return fullUrl.substring(index + urlPath.length());
        }

        return null;
    }

    private void deleteImageByUrl(String imageUrl) {
        String fileName = extractFileNameFromUrl(imageUrl);
        if (fileName != null && !fileName.isBlank()) {
            Path fullPath = Paths.get(uploadDirectory, fileName);
            try {
                Files.deleteIfExists(fullPath);
            } catch (IOException e) {
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

            String fileName = "journal_" + code + "_" + System.currentTimeMillis() + "." + ext;

            File dir = new File(uploadDirectory);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    throw new RuntimeException("Failed to create upload directory: " + uploadDirectory);
                }
            }

            Path filePath = Paths.get(uploadDirectory, fileName);

            try (InputStream input = file.getInputStream();
                 OutputStream output = Files.newOutputStream(filePath, StandardOpenOption.CREATE)) {

                Thumbnails.of(input)
                        .size(500, 500)
                        .outputFormat(ext)
                        .outputQuality(0.75f)
                        .toOutputStream(output);
            }

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save compressed cover image.", e);
        }
    }

    public AdminJournalDto getJournalByCode(String journalUrl) {
        if (journalUrl == null || journalUrl.isEmpty() || journalUrl.equals("undefined")) {
            throw new IllegalArgumentException("Journal code is required");
        }

        return journalRepository.findByJournalUrl(journalUrl)
                .map(this::mapJournalToAdminJournalDto)
                .orElseThrow(() -> new IllegalArgumentException("Journal not found with code: " + journalUrl));
    }
}
