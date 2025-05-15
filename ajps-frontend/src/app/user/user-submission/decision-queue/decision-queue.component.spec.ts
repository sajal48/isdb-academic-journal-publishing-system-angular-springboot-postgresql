import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionQueueComponent } from './decision-queue.component';

describe('DecisionQueueComponent', () => {
  let component: DecisionQueueComponent;
  let fixture: ComponentFixture<DecisionQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
