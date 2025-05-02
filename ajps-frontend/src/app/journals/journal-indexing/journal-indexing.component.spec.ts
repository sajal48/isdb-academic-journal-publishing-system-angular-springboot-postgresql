import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalIndexingComponent } from './journal-indexing.component';

describe('JournalIndexingComponent', () => {
  let component: JournalIndexingComponent;
  let fixture: ComponentFixture<JournalIndexingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalIndexingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalIndexingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
