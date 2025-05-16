import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerAssignedManuscriptsComponent } from './reviewer-assigned-manuscripts.component';

describe('ReviewerAssignedManuscriptsComponent', () => {
  let component: ReviewerAssignedManuscriptsComponent;
  let fixture: ComponentFixture<ReviewerAssignedManuscriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewerAssignedManuscriptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerAssignedManuscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
