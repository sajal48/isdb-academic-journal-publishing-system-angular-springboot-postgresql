import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSubmissionsNewComponent } from './editor-submissions-new.component';

describe('EditorSubmissionsNewComponent', () => {
  let component: EditorSubmissionsNewComponent;
  let fixture: ComponentFixture<EditorSubmissionsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorSubmissionsNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorSubmissionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
