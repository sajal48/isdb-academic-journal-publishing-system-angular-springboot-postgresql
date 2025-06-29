package com.himusharier.ajps_backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditorialBoardMemberDTO {
    private Long profileId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String designation;
}