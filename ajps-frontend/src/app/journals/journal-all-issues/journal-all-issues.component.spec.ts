import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalAllIssuesComponent } from './journal-all-issues.component';

describe('JournalAllIssuesComponent', () => {
  let component: JournalAllIssuesComponent;
  let fixture: ComponentFixture<JournalAllIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalAllIssuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalAllIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
