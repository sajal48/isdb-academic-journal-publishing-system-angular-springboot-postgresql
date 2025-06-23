package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.EditorDTO;
import com.himusharier.ajps_backend.service.EditorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/editors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EditorController {

    private final EditorService editorService;

    @GetMapping("/all")
    public ResponseEntity<List<EditorDTO>> getAllEditors() {
        return ResponseEntity.ok(editorService.getAllEditors());
    }

    @PostMapping("/assign-journals")
    public ResponseEntity<Void> assignJournals(
            @RequestBody EditorDTO dto) {
        editorService.assignJournalsToEditor(dto.getProfileId(), dto.getAssignedJournalsIds());
        return ResponseEntity.ok().build();
    }
}
