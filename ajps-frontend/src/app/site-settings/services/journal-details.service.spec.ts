import { TestBed } from '@angular/core/testing';

import { JournalDetailsService } from './journal-details.service';

describe('JournalDetailsService', () => {
  let service: JournalDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
