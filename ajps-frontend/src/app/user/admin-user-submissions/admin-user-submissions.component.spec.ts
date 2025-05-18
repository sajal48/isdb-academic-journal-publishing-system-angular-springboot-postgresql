import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserSubmissionsComponent } from './admin-user-submissions.component';

describe('AdminUserSubmissionsComponent', () => {
  let component: AdminUserSubmissionsComponent;
  let fixture: ComponentFixture<AdminUserSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
