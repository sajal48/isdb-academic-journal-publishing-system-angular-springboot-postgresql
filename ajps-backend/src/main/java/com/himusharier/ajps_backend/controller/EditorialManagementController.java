package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.editorial.AssignRequest;
import com.himusharier.ajps_backend.dto.editorial.EditorDto;
import com.himusharier.ajps_backend.model.Journal;
import com.himusharier.ajps_backend.service.EditorialManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/editorial")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EditorialManagementController {

    private final EditorialManagementService editorialService;

    @GetMapping("/journals")
    public List<Journal> getJournals() {
        return editorialService.getAllJournals();
    }

    @GetMapping("/editors")
    public List<EditorDto> getEditors() {
        return editorialService.getAllEditors();
    }

    @PostMapping("/editors/assign")
    public ResponseEntity<?> assignEditor(@RequestBody AssignRequest request) {
        editorialService.assignEditor(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/editors/unassign")
    public ResponseEntity<?> unassignEditor(@RequestParam Long profileId, @RequestParam Long journalId) {
        editorialService.removeEditor(profileId, journalId);
        return ResponseEntity.ok().build();
    }
}
