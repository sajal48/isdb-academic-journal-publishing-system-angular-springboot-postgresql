import { TestBed } from '@angular/core/testing';

import { JournalPublicationOperationsService } from './journal-publication-operations.service';

describe('JournalPublicationOperationsService', () => {
  let service: JournalPublicationOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalPublicationOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
