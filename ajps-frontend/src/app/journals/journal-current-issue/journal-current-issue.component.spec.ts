import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalCurrentIssueComponent } from './journal-current-issue.component';

describe('JournalCurrentIssueComponent', () => {
  let component: JournalCurrentIssueComponent;
  let fixture: ComponentFixture<JournalCurrentIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalCurrentIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalCurrentIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
