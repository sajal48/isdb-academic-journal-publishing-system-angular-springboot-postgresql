import { TestBed } from '@angular/core/testing';

import { UserSubmissionDetailsService } from './user-submission-details.service';

describe('UserSubmissionDetailsService', () => {
  let service: UserSubmissionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSubmissionDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
