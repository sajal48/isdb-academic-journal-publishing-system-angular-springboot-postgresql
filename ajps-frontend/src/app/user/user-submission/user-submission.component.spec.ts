import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubmissionComponent } from './user-submission.component';

describe('UserSubmissionComponent', () => {
  let component: UserSubmissionComponent;
  let fixture: ComponentFixture<UserSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
