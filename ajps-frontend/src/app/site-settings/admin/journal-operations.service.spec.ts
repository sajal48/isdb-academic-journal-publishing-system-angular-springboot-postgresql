import { TestBed } from '@angular/core/testing';

import { JournalOperationsService } from './journal-operations.service';

describe('JournalOperationsService', () => {
  let service: JournalOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
