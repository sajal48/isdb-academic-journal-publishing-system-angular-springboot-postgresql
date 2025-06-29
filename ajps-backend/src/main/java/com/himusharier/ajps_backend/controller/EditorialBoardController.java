package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.dto.request.EditorialBoardMemberDTO;
import com.himusharier.ajps_backend.service.EditorialManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/editorial-board")
@RequiredArgsConstructor
public class EditorialBoardController {

    private final EditorialManagementService editorialManagementService;

    @GetMapping("/journal/{journalId}")
    public List<EditorialBoardMemberDTO> getEditorialBoardForJournal(@PathVariable Long journalId) {
        return editorialManagementService.getEditorialBoardForJournal(journalId);
    }

    // In EditorialBoardController
    /*@GetMapping("/all")
    public Map<Long, List<EditorialBoardMemberDTO>> getAllEditorialBoards() {
        return editorialManagementService.getAllEditorialBoards();
    }*/
}