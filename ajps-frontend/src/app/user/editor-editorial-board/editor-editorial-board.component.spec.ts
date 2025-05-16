import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorEditorialBoardComponent } from './editor-editorial-board.component';

describe('EditorEditorialBoardComponent', () => {
  let component: EditorEditorialBoardComponent;
  let fixture: ComponentFixture<EditorEditorialBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorEditorialBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorEditorialBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
