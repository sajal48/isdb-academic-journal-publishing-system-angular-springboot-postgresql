package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.AdminJournalDto;
import com.himusharier.ajps_backend.service.JournalService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JournalController {

    @Autowired
    private final JournalService journalService;

    @GetMapping("/get-all-journals")
    public ResponseEntity<List<AdminJournalDto>> getAllJournals() {
        return ResponseEntity.ok(journalService.getAllJournals());
    }
    /*@GetMapping("/get-all-journals")
    public ResponseEntity<List<AdminJournalDto>> getAllJournals(HttpServletRequest request) {
        // Get base URL from the request
        String baseUrl = UriComponentsBuilder.fromHttpUrl(request.getRequestURL().toString())
                .replacePath("")
                .build()
                .toUriString();

        return ResponseEntity.ok(journalService.getAllJournals(baseUrl));
    }*/

    @GetMapping("/get-journal/{journalUrl}")
    public ResponseEntity<AdminJournalDto> getJournalByCode(@PathVariable String journalUrl) {
        journalUrl = journalUrl.toLowerCase();
        if (journalUrl == null || journalUrl.isEmpty() || journalUrl.equals("undefined")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(journalService.getJournalByCode(journalUrl));
    }

    @PostMapping(value = "/create-journal", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdminJournalDto> createJournal(
            @RequestPart("journal") AdminJournalDto dto,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage) {
        return ResponseEntity.ok(journalService.createJournal(dto, coverImage));
    }

    @PutMapping(value = "/update-journal/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdminJournalDto> updateJournal(
            @PathVariable Long id,
            @RequestPart("journal") AdminJournalDto dto,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage) {
        return ResponseEntity.ok(journalService.updateJournal(id, dto, coverImage));
    }

    @DeleteMapping("/delete-journal/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id) {
        journalService.deleteJournal(id);
        return ResponseEntity.noContent().build();
    }
}