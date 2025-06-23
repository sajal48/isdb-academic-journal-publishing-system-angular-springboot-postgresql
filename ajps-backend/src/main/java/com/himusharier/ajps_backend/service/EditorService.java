package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.constants.UserRole;
import com.himusharier.ajps_backend.dto.request.EditorDTO;
import com.himusharier.ajps_backend.dto.request.JournalShortDTO;
import com.himusharier.ajps_backend.model.*;
import com.himusharier.ajps_backend.repository.AuthRepository;
import com.himusharier.ajps_backend.repository.EditorRepository;
import com.himusharier.ajps_backend.repository.JournalRepository;
import com.himusharier.ajps_backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EditorService {

    private final AuthRepository authRepository;
    private final ProfileRepository profileRepository;
    private final JournalRepository journalRepository;
    private final EditorRepository editorRepository;

    public List<EditorDTO> getAllEditors() {
        List<Auth> editorAuths = authRepository.findByUserRole(UserRole.EDITOR);

        return editorAuths.stream()
                .filter(auth -> auth.getProfile() != null)
                .map(auth -> {
                    Profile profile = auth.getProfile();
                    Editor editor = editorRepository.findByProfileId(profile.getId());

                    List<JournalShortDTO> assignedJournals = editor != null
                            ? editor.getAssignedJournals().stream()
                            .map(j -> new JournalShortDTO(j.getId(), j.getJournalName()))
                            .collect(Collectors.toList())
                            : List.of();

                    return EditorDTO.builder()
                            .authId(auth.getId())
                            .profileId(profile.getId())
                            .firstName(profile.getFirstName())
                            .middleName(profile.getMiddleName())
                            .lastName(profile.getLastName())
                            .email(auth.getEmail())
                            .assignedJournals(assignedJournals)
                            .build();
                })
                .toList();

    }

    public void assignJournalsToEditor(Long profileId, List<Long> journalIds) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Editor editor = editorRepository.findByProfileId(profileId);
        if (editor == null) {
            editor = Editor.builder()
                    .profile(profile)
                    .build();
        }

        List<Journal> selectedJournals = journalRepository.findAllById(journalIds);
        editor.setAssignedJournals(selectedJournals);

        editorRepository.save(editor);
    }
}
