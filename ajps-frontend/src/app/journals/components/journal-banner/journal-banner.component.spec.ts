import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalBannerComponent } from './journal-banner.component';

describe('JournalBannerComponent', () => {
  let component: JournalBannerComponent;
  let fixture: ComponentFixture<JournalBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
