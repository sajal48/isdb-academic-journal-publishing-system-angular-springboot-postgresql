import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalProcessingChargeComponent } from './journal-processing-charge.component';

describe('JournalProcessingChargeComponent', () => {
  let component: JournalProcessingChargeComponent;
  let fixture: ComponentFixture<JournalProcessingChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalProcessingChargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalProcessingChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
