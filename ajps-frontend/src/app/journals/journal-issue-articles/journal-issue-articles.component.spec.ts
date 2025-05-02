import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalIssueArticlesComponent } from './journal-issue-articles.component';

describe('JournalIssueArticlesComponent', () => {
  let component: JournalIssueArticlesComponent;
  let fixture: ComponentFixture<JournalIssueArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalIssueArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalIssueArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
