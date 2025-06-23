package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.model.Issue;
import com.himusharier.ajps_backend.model.Journal;
import com.himusharier.ajps_backend.repository.IssueRepository;
import com.himusharier.ajps_backend.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class IssueController {
    @Autowired
    private IssueRepository issues;
    @Autowired private JournalRepository journals;

    @GetMapping("/journals/{jid}/issues")
    public List<Issue> forJournal(@PathVariable Long jid) {
        return issues.findByJournalId(jid);
    }

    @PostMapping("/journals/{jid}/issues")
    public Issue addIssue(@PathVariable Long jid, @RequestBody Issue issue) {
        Journal j = journals.findById(jid).orElseThrow();
        issue.setJournal(j);
        return issues.save(issue);
    }

    @PutMapping("/issues/{id}")
    public Issue updateIssue(@PathVariable Long id, @RequestBody Issue u) {
        return issues.findById(id).map(i -> {
            i.setVolume(u.getVolume());
            i.setNumber(u.getNumber());
            i.setPublicationDate(u.getPublicationDate());
            i.setStatus(u.getStatus());
            return issues.save(i);
        }).orElseThrow();
    }

    @DeleteMapping("/issues/{id}")
    public void deleteIssue(@PathVariable Long id) { issues.deleteById(id); }
}