import { TestBed } from '@angular/core/testing';

import { ManuscriptSubmissionService } from './manuscript-submission.service';

describe('ManuscriptSubmissionService', () => {
  let service: ManuscriptSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManuscriptSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
