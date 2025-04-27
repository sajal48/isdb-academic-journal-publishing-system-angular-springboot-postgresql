import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalAnnouncementComponent } from './journal-announcement.component';

describe('JournalAnnouncementComponent', () => {
  let component: JournalAnnouncementComponent;
  let fixture: ComponentFixture<JournalAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalAnnouncementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
