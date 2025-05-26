package com.himusharier.ajps_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Represents a Reviewer as a Plain Old Java Object (POJO).
 * This class is intended to be used when parsing the 'reviewersJson'
 * field from the ManuscriptSubmission entity.
 * It does not have JPA annotations as it's not a separate entity table,
 * but rather a data structure within the JSON string.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewerDTO implements Serializable {

    private String name;
    private String email;
    private String institution;

}
