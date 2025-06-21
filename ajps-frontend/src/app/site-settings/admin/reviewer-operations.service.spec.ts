import { TestBed } from '@angular/core/testing';

import { ReviewerOperationsService } from './reviewer-operations.service';

describe('ReviewerOperationsService', () => {
  let service: ReviewerOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewerOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
