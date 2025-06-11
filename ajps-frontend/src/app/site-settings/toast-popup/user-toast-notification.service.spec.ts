import { TestBed } from '@angular/core/testing';

import { UserToastNotificationService } from '../toast-popup/user-toast-notification.service';

describe('UserToastNotificationService', () => {
  let service: UserToastNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserToastNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
