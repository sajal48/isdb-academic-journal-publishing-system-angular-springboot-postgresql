import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalHomepageComponent } from './journal-homepage.component';

describe('JournalHomepageComponent', () => {
  let component: JournalHomepageComponent;
  let fixture: ComponentFixture<JournalHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
