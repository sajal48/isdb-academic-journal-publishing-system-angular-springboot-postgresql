import { TestBed } from '@angular/core/testing';

import { EditorialManagementService } from './editorial-management.service';

describe('EditorialManagementService', () => {
  let service: EditorialManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorialManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
