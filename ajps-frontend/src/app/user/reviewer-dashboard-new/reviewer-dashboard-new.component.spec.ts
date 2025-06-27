import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerDashboardNewComponent } from './reviewer-dashboard-new.component';

describe('ReviewerDashboardNewComponent', () => {
  let component: ReviewerDashboardNewComponent;
  let fixture: ComponentFixture<ReviewerDashboardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewerDashboardNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerDashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
