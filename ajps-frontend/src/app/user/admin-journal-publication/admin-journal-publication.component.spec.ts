import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJournalPublicationComponent } from './admin-journal-publication.component';

describe('AdminJournalPublicationComponent', () => {
  let component: AdminJournalPublicationComponent;
  let fixture: ComponentFixture<AdminJournalPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminJournalPublicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJournalPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
