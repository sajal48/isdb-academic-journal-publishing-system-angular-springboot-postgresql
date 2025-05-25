import { TestBed } from '@angular/core/testing';

import { UserProfileSettingsService } from './user-profile-settings.service';

describe('UserProfileSettingsService', () => {
  let service: UserProfileSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
