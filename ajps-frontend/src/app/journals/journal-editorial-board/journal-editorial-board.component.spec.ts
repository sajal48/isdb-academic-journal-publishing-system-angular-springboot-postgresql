import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEditorialBoardComponent } from './journal-editorial-board.component';

describe('JournalEditorialBoardComponent', () => {
  let component: JournalEditorialBoardComponent;
  let fixture: ComponentFixture<JournalEditorialBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEditorialBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEditorialBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
