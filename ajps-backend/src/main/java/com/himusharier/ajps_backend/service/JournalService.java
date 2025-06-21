package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.dto.request.AdminJournalDto;
import com.himusharier.ajps_backend.model.Journal;
import com.himusharier.ajps_backend.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;

    public List<AdminJournalDto> getAllJournals() {
        return journalRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AdminJournalDto createJournal(AdminJournalDto dto) {
        if (journalRepository.existsByIssn(dto.getIssn())) {
            throw new IllegalArgumentException("ISSN already exists.");
        }
        if (journalRepository.existsByJournalCode(dto.getJournalCode())) {
            throw new IllegalArgumentException("Journal code already exists.");
        }
        Journal journal = convertToEntity(dto);
        return convertToDto(journalRepository.save(journal));
    }

    public AdminJournalDto updateJournal(Long id, AdminJournalDto dto) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal not found."));
        dto.setId(id);
        BeanUtils.copyProperties(dto, journal);
        return convertToDto(journalRepository.save(journal));
    }

    public void deleteJournal(Long id) {
        journalRepository.deleteById(id);
    }

    private AdminJournalDto convertToDto(Journal journal) {
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
}
