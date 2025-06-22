package com.himusharier.ajps_backend.dto.editorial;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EditorDto {
    private Long profileId;
    private String firstName;
    private String lastName;
    private String email;
    private List<AssignmentDto> assignedJournals;
}
