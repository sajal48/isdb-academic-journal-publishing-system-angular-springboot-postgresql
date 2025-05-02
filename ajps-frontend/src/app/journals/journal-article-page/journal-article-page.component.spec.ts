import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalArticlePageComponent } from './journal-article-page.component';

describe('JournalArticlePageComponent', () => {
  let component: JournalArticlePageComponent;
  let fixture: ComponentFixture<JournalArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalArticlePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
