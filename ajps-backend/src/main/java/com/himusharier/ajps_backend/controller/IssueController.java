package com.himusharier.ajps_backend.controller;

import com.himusharier.ajps_backend.constants.IssueStatus;
import com.himusharier.ajps_backend.dto.request.IssueDto;
import com.himusharier.ajps_backend.exception.JournalOperationException;
import com.himusharier.ajps_backend.model.Issue;
import com.himusharier.ajps_backend.model.Journal;
import com.himusharier.ajps_backend.repository.IssueRepository;
import com.himusharier.ajps_backend.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
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

    /*@PostMapping("/journals/{jid}/issues")
    public Issue addIssue(@PathVariable Long jid, @RequestBody Issue issue) {
        Journal j = journals.findById(jid).orElseThrow();
        issue.setJournal(j);
        return issues.save(issue);
    }*/
    @PostMapping("/journals/{jid}/issues")
    public Issue addIssue(@PathVariable Long jid, @RequestBody IssueDto issueDto) {
        Journal journal = journals.findById(jid).orElseThrow();
        Issue issue = Issue.builder()
                .volume(issueDto.getVolume())
                .number(issueDto.getNumber())
                .publicationDate(issueDto.getPublicationDate())
                .status(IssueStatus.valueOf(issueDto.getStatus()))
                .journal(journal)
                .build();
        return issues.save(issue);
    }

    /*@PutMapping("/issues/{id}")
    public Issue updateIssue(@PathVariable Long id, @RequestBody Issue u) {
        return issues.findById(id).map(i -> {
            i.setVolume(u.getVolume());
            i.setNumber(u.getNumber());
            i.setPublicationDate(u.getPublicationDate());
            i.setStatus(u.getStatus());
            return issues.save(i);
        }).orElseThrow();
    }*/
    @PutMapping("/issues/{id}")
    public Issue updateIssue(@PathVariable Long id, @RequestBody IssueDto issueDto) {
        return issues.findById(id).map(issue -> {
            issue.setVolume(issueDto.getVolume());
            issue.setNumber(issueDto.getNumber());
            issue.setPublicationDate(issueDto.getPublicationDate());
            issue.setStatus(IssueStatus.valueOf(issueDto.getStatus()));
            return issues.save(issue);
        }).orElseThrow();
    }

    @DeleteMapping("/issues/{id}")
    public void deleteIssue(@PathVariable Long id) { issues.deleteById(id); }

    @GetMapping("/journal/get-journal/{journalUrl}/issues")
    public List<Issue> getIssuesByJournalUrl(@PathVariable String journalUrl) {
        Journal journal = journals.findByJournalUrl(journalUrl)
                .orElseThrow(() -> new JournalOperationException("Journal not found"));
        return issues.findByJournalId(journal.getId());
    }

    @GetMapping("/journal/get-journal/{journalUrl}/current-issue")
    public Issue getCurrentIssue(@PathVariable String journalUrl) {
        Journal journal = journals.findByJournalUrl(journalUrl)
                .orElseThrow(() -> new JournalOperationException("Journal not found"));

        return issues.findByJournalId(journal.getId()).stream()
                .filter(issue -> issue.getStatus() == IssueStatus.PUBLISHED)
                .max(Comparator.comparing(Issue::getPublicationDate))
                .orElseThrow(() -> new JournalOperationException("No published issues found"));
    }

}