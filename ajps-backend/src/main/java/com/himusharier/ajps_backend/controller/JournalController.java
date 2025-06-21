package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.AdminJournalDto;
import com.himusharier.ajps_backend.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JournalController {

    private final JournalService journalService;

    @GetMapping("/get-all-journals")
    public ResponseEntity<List<AdminJournalDto>> getAllJournals() {
        return ResponseEntity.ok(journalService.getAllJournals());
    }

    @PostMapping("/create-journal")
    public ResponseEntity<AdminJournalDto> createJournal(@RequestBody AdminJournalDto dto) {
        return ResponseEntity.ok(journalService.createJournal(dto));
    }

    @PutMapping("/update-journal/{id}")
    public ResponseEntity<AdminJournalDto> updateJournal(@PathVariable Long id, @RequestBody AdminJournalDto dto) {
        return ResponseEntity.ok(journalService.updateJournal(id, dto));
    }

    @DeleteMapping("/delete-journal/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id) {
        journalService.deleteJournal(id);
        return ResponseEntity.noContent().build();
    }
}
