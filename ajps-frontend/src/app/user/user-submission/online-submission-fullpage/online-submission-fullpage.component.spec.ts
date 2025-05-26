import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSubmissionFullpageComponent } from './online-submission-fullpage.component';

describe('OnlineSubmissionFullpageComponent', () => {
  let component: OnlineSubmissionFullpageComponent;
  let fixture: ComponentFixture<OnlineSubmissionFullpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineSubmissionFullpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineSubmissionFullpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
