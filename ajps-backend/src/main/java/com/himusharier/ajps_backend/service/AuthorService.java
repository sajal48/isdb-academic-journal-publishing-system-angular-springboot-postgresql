package com.himusharier.ajps_backend.service;

import com.himusharier.ajps_backend.dto.submission.AuthorDTO;
import com.himusharier.ajps_backend.dto.submission.AuthorInformationRequest;
import com.himusharier.ajps_backend.model.Author;
import com.himusharier.ajps_backend.model.Submission;
import com.himusharier.ajps_backend.repository.AuthorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    /*public List<Author> saveAuthors(List<AuthorDTO> authorDTOs, Submission submission) {
        List<Author> authors = authorDTOs.stream()
                .map(dto -> {
                    Author author = new Author();
                    author.setName(dto.name());
                    author.setEmail(dto.email());
                    author.setInstitution(dto.institution());
                    author.setCorresponding(dto.isCorresponding());
                    author.setSubmission(submission);
                    return author;
                })
                .collect(Collectors.toList());

        return authorRepository.saveAll(authors);
    }*/

    @Transactional
    public List<Author> saveAuthors(List<AuthorDTO> authors, Submission submission) {
        List<Author> savedAuthors = new ArrayList<>();

        for (AuthorDTO authorInfo : authors) {
            Author author = new Author();
            author.setName(authorInfo.name());
            author.setEmail(authorInfo.email());
            author.setInstitution(authorInfo.institution());
            author.setCorresponding(authorInfo.corresponding());
            author.setSubmission(submission);

            savedAuthors.add(authorRepository.save(author));
        }

        return savedAuthors;
    }

    @Transactional
    public void removeAuthor(Long submissionId, String authorEmail) {
        authorRepository.deleteBySubmissionIdAndEmail(submissionId, authorEmail);
    }

}
