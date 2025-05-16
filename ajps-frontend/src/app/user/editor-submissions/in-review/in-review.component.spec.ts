import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InReviewComponent } from './in-review.component';

describe('InReviewComponent', () => {
  let component: InReviewComponent;
  let fixture: ComponentFixture<InReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
