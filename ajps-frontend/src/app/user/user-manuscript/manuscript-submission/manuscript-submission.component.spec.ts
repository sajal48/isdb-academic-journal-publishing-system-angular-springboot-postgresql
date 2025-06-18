import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptSubmissionComponent } from './manuscript-submission.component';

describe('ManuscriptSubmissionComponent', () => {
  let component: ManuscriptSubmissionComponent;
  let fixture: ComponentFixture<ManuscriptSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManuscriptSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
