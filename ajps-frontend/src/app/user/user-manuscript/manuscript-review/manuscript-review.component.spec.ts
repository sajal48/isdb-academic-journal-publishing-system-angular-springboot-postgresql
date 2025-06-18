import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptReviewComponent } from './manuscript-review.component';

describe('ManuscriptReviewComponent', () => {
  let component: ManuscriptReviewComponent;
  let fixture: ComponentFixture<ManuscriptReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManuscriptReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
