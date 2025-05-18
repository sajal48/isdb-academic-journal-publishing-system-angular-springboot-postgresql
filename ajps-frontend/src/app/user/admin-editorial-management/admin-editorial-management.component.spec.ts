import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditorialManagementComponent } from './admin-editorial-management.component';

describe('AdminEditorialManagementComponent', () => {
  let component: AdminEditorialManagementComponent;
  let fixture: ComponentFixture<AdminEditorialManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditorialManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditorialManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
