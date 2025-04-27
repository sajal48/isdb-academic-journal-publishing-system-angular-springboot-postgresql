import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEditorialComponent } from './journal-editorial.component';

describe('JournalEditorialComponent', () => {
  let component: JournalEditorialComponent;
  let fixture: ComponentFixture<JournalEditorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEditorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEditorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
