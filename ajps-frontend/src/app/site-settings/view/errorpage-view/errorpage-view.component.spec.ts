import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorpageViewComponent } from './errorpage-view.component';

describe('ErrorpageViewComponent', () => {
  let component: ErrorpageViewComponent;
  let fixture: ComponentFixture<ErrorpageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorpageViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorpageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
