import { TestBed } from '@angular/core/testing';

import { AuthLoginRegisterService } from './auth-login-register.service';

describe('AuthLoginRegisterService', () => {
  let service: AuthLoginRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthLoginRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
