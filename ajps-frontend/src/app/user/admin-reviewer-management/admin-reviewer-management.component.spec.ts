import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReviewerManagementComponent } from './admin-reviewer-management.component';

describe('AdminReviewerManagementComponent', () => {
  let component: AdminReviewerManagementComponent;
  let fixture: ComponentFixture<AdminReviewerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReviewerManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReviewerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
