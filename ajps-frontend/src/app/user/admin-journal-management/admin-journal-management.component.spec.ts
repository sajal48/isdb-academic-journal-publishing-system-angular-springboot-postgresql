import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJournalManagementComponent } from './admin-journal-management.component';

describe('AdminJournalManagementComponent', () => {
  let component: AdminJournalManagementComponent;
  let fixture: ComponentFixture<AdminJournalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminJournalManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJournalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
