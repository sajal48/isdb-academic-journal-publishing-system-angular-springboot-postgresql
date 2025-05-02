import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalSubmissionComponent } from './journal-submission.component';

describe('JournalSubmissionComponent', () => {
  let component: JournalSubmissionComponent;
  let fixture: ComponentFixture<JournalSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
