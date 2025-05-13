import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorReviewersComponent } from './editor-reviewers.component';

describe('EditorReviewersComponent', () => {
  let component: EditorReviewersComponent;
  let fixture: ComponentFixture<EditorReviewersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorReviewersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorReviewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
