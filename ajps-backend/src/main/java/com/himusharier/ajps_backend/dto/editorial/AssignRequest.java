package com.himusharier.ajps_backend.dto.editorial;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignRequest {
    private Long profileId;
    private Long journalId;
    private String designation;
}
