import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSubmissionsComponent } from './editor-submissions.component';

describe('EditorSubmissionsComponent', () => {
  let component: EditorSubmissionsComponent;
  let fixture: ComponentFixture<EditorSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
