import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerSubmittedReviewsComponent } from './reviewer-submitted-reviews.component';

describe('ReviewerSubmittedReviewsComponent', () => {
  let component: ReviewerSubmittedReviewsComponent;
  let fixture: ComponentFixture<ReviewerSubmittedReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewerSubmittedReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerSubmittedReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
