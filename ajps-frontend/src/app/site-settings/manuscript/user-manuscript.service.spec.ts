import { TestBed } from '@angular/core/testing';

import { UserManuscriptService } from './user-manuscript.service';

describe('UserManuscriptService', () => {
  let service: UserManuscriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManuscriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
