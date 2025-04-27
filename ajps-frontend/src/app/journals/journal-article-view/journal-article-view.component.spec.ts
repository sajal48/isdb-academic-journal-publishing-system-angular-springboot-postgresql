import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalArticleViewComponent } from './journal-article-view.component';

describe('JournalArticleViewComponent', () => {
  let component: JournalArticleViewComponent;
  let fixture: ComponentFixture<JournalArticleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalArticleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalArticleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
