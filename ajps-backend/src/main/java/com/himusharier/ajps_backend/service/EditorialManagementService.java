package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.dto.editorial.AssignRequest;
import com.himusharier.ajps_backend.dto.editorial.AssignmentDto;
import com.himusharier.ajps_backend.dto.editorial.EditorDto;
import com.himusharier.ajps_backend.dto.request.EditorialBoardMemberDTO;
import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.EditorAssignment;
import com.himusharier.ajps_backend.model.Journal;
import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EditorialManagementService {

    private final AuthRepository authRepo;
    private final ProfileRepository profileRepo;
    private final JournalRepository journalRepo;
    private final EditorAssignmentRepository assignmentRepo;

    public List<Journal> getAllJournals() {
        return journalRepo.findAll();
    }

    public List<EditorDto> getAllEditors() {
        return profileRepo.findAll().stream()
                .filter(profile -> profile.getAuth().getUserRole() == UserRole.EDITOR)
                .map(this::mapToDto).toList();
    }

    private EditorDto mapToDto(Profile profile) {
        EditorDto dto = new EditorDto();
        dto.setProfileId(profile.getId());
        dto.setFirstName(profile.getFirstName());
        dto.setMiddleName(profile.getMiddleName());
        dto.setLastName(profile.getLastName());
        dto.setEmail(profile.getAuth().getEmail());

        List<AssignmentDto> assignments = assignmentRepo.findByProfileId(profile.getId()).stream()
                .map(a -> new AssignmentDto(a.getJournal().getId(), a.getDesignation())).toList();
        dto.setAssignedJournals(assignments);
        return dto;
    }

    public void assignEditor(AssignRequest req) {
        Profile profile = profileRepo.findById(req.getProfileId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        Journal journal = journalRepo.findById(req.getJournalId())
                .orElseThrow(() -> new RuntimeException("Journal not found"));

        EditorAssignment ea = new EditorAssignment();
        ea.setProfile(profile);
        ea.setJournal(journal);
        ea.setDesignation(req.getDesignation());
        assignmentRepo.save(ea);
    }

    @Transactional
    public void removeEditor(Long profileId, Long journalId) {
        assignmentRepo.deleteByProfileIdAndJournalId(profileId, journalId);
    }


    // Add this method to EditorialManagementService
    public List<EditorialBoardMemberDTO> getEditorialBoardForJournal(Long journalId) {
        List<EditorAssignment> assignments = assignmentRepo.findByJournalId(journalId);

        return assignments.stream()
                .map(assignment -> {
                    Profile profile = assignment.getProfile();
                    Auth auth = profile.getAuth();

                    return EditorialBoardMemberDTO.builder()
                            .profileId(profile.getId())
                            .firstName(profile.getFirstName())
                            .middleName(profile.getMiddleName())
                            .lastName(profile.getLastName())
                            .email(auth.getEmail())
                            .designation(assignment.getDesignation())
                            .build();
                })
                .toList();
    }

    // In EditorialManagementService
    /*public Map<Long, List<EditorialBoardMemberDTO>> getAllEditorialBoards() {
        List<Journal> journals = journalRepo.findAll();
        return journals.stream()
                .collect(Collectors.toMap(
                        Journal::getId,
                        journal -> getEditorialBoardForJournal(journal.getId())
                );
    }*/

}