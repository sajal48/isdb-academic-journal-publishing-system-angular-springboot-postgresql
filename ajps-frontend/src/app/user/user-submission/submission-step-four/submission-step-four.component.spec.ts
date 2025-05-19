import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionStepFourComponent } from './submission-step-four.component';

describe('SubmissionStepFourComponent', () => {
  let component: SubmissionStepFourComponent;
  let fixture: ComponentFixture<SubmissionStepFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionStepFourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionStepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
