import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorReportsComponent } from './editor-reports.component';

describe('EditorReportsComponent', () => {
  let component: EditorReportsComponent;
  let fixture: ComponentFixture<EditorReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
