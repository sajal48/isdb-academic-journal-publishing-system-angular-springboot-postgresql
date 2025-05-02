import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalAnnouncementsComponent } from './journal-announcements.component';

describe('JournalAnnouncementsComponent', () => {
  let component: JournalAnnouncementsComponent;
  let fixture: ComponentFixture<JournalAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalAnnouncementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
