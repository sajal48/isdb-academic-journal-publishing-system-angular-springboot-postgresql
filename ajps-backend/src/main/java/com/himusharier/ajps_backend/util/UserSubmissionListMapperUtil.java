package com.himusharier.ajps_backend.util;

import com.himusharier.ajps_backend.dto.response.SubmissionListResponse;
import com.himusharier.ajps_backend.model.Submission;

public class UserSubmissionListMapperUtil {

    public static SubmissionListResponse submissionListResponseFromSubmission(Submission submission) {
        return new SubmissionListResponse(
                submission.getId(),
                submission.getJournalName(),
                submission.getManuscriptTitle(),
                submission.getManuscriptCategory(),
                submission.getSubmissionStatus(),
                submission.getSubmittedAt(),
                submission.getUpdatedAt(),
                submission.isPaymentDue(),
                submission.isEditable());
    }
}
