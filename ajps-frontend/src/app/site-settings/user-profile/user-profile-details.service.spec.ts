import { TestBed } from '@angular/core/testing';

import { UserProfileDetailsService } from './user-profile-details.service';

describe('UserProfileDetailsService', () => {
  let service: UserProfileDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
