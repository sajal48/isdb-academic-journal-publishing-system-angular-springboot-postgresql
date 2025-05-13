import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorOverviewComponent } from './editor-overview.component';

describe('EditorOverviewComponent', () => {
  let component: EditorOverviewComponent;
  let fixture: ComponentFixture<EditorOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
