package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.model.Issue;
import com.himusharier.ajps_backend.model.Paper;
import com.himusharier.ajps_backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/issues/{iid}/papers")
public class PaperController {
    @Autowired
    private IssueRepository issues;

    @PostMapping
    public Issue addPaper(@PathVariable Long iid, @RequestBody Paper p) {
        Issue i = issues.findById(iid).orElseThrow();
        i.getPapers().add(p);
        return issues.save(i);
    }

    @PutMapping("/{pid}") public Paper updatePaper(@PathVariable Long iid, @PathVariable Long pid, @RequestBody Paper p) {
        Issue i = issues.findById(iid).orElseThrow();
        Paper existing = i.getPapers().stream().filter(x -> x.getId().equals(pid)).findFirst().orElseThrow();
        issues.save(i);
        return existing;
    }

    @DeleteMapping("/{pid}") public Issue deletePaper(@PathVariable Long iid, @PathVariable Long pid) {
        Issue i = issues.findById(iid).orElseThrow();
        i.getPapers().removeIf(x -> x.getId().equals(pid));
        return issues.save(i);
    }
}