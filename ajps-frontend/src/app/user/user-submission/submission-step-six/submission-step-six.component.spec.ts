import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionStepSixComponent } from './submission-step-six.component';

describe('SubmissionStepSixComponent', () => {
  let component: SubmissionStepSixComponent;
  let fixture: ComponentFixture<SubmissionStepSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionStepSixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionStepSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
