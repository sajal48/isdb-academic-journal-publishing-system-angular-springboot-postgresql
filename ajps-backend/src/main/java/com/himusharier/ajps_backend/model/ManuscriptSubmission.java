package com.himusharier.ajps_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable; // Recommended for JPA entities

/**
 * Represents a manuscript submission entity in the database.
 * This entity maps to the 'manuscript_submissions' table.
 *
 * Note on file storage: The 'manuscriptFilePathOrUrl' field stores a reference
 * (e.g., path, URL) to the actual file, not the file content itself.
 * Large files should typically be stored in a file system (e.g., local disk, S3)
 * or a dedicated blob storage, and their location referenced in the database.
 *
 * Note on reviewers: The 'reviewersJson' field stores the list of reviewers
 * as a JSON string. For a more relational approach, 'Reviewer' could be a
 * separate entity with a One-to-Many relationship to ManuscriptSubmission,
 * requiring a join table or foreign keys. This approach simplifies direct
 * mapping from the frontend's JSON.stringify.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ajps_manuscript_submissions")
public class ManuscriptSubmission implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key for the entity

    @Column(nullable = false)
    private String journal;

    @Column(nullable = false)
    private String articleTitle;

    @Column(nullable = false)
    private String articleCategory;

    @Lob // Used for large text fields (e.g., CLOB in SQL)
    @Column(nullable = false)
    private String abstractContent; // Renamed from 'abstract' to avoid Java keyword conflict

    @Lob
    @Column(nullable = false)
    private String keywords;

    @Column(nullable = false)
    private String correspondingAuthor;

    @Column(nullable = false)
    private String authorEmail;

    @Column(nullable = false)
    private String institution;

    // Stores the path or URL to the uploaded manuscript file
    @Column(name = "manuscript_file_path_or_url")
    private String manuscriptFilePathOrUrl;

    // Stores the original file name for display purposes
    @Column(name = "file_name")
    private String fileName;

    @Lob // Stores the JSON string representation of the reviewers list
    @Column(name = "reviewers_json", columnDefinition = "TEXT") // Use TEXT for potentially long JSON strings
    private String reviewersJson;

    @Lob
    @Column(name = "comments") // Comments field can be nullable as per frontend logic
    private String comments;

}
