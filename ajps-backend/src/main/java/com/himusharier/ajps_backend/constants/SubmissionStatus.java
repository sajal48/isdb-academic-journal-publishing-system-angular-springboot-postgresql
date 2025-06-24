package com.himusharier.ajps_backend.constants;

public enum SubmissionStatus {
    SAVED,
    SUBMITTED,
    UNDER_REVIEW,
    REVISION_REQUIRED,
    ACCEPTED,
    DUE_PAYMENT,
    COPY_EDITING,
    PUBLICATION,
    PUBLISHED,
    REJECTED
}

/*
Submission Status Color Codes
Here are recommended color codes for each SubmissionStatus value:

SAVED: #808080 (Gray)
Represents a neutral or pending state. The submission is not yet active in the workflow.

SUBMITTED: #4682B4 (Steel Blue)
Indicates a new, active state where the submission has just entered the system.

UNDER_REVIEW: #FFD700 (Gold)
Suggests a process in progress, often implying a waiting period or active evaluation.

REVISION_REQUIRED: #FFA500 (Orange)
A warning color, indicating that action is needed from the user to proceed.

ACCEPTED: #228B22 (Forest Green)
A strong positive color, signifying approval and progression.

DUE_PAYMENT: #DC143C (Crimson)
A critical color, indicating a financial action is pending and potentially blocking further progress.

COPY_EDITING: #1E90FF (Dodger Blue)
Represents a technical or refining phase, often indicating professional handling.

PUBLICATION: #8A2BE2 (Blue Violet)
A regal or significant color, signifying a nearing completion or public release.

PUBLISHED: #008000 (Green)
The ultimate positive and final state, representing completion and success.

*/
