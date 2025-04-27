import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalArticleListComponent } from './journal-article-list.component';

describe('JournalArticleListComponent', () => {
  let component: JournalArticleListComponent;
  let fixture: ComponentFixture<JournalArticleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalArticleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalArticleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
