import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditorManagementComponent } from './admin-editor-management.component';

describe('AdminEditorManagementComponent', () => {
  let component: AdminEditorManagementComponent;
  let fixture: ComponentFixture<AdminEditorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditorManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
