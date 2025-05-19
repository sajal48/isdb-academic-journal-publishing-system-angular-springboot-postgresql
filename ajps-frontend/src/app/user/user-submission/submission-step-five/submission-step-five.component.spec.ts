import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionStepFiveComponent } from './submission-step-five.component';

describe('SubmissionStepFiveComponent', () => {
  let component: SubmissionStepFiveComponent;
  let fixture: ComponentFixture<SubmissionStepFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionStepFiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionStepFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
